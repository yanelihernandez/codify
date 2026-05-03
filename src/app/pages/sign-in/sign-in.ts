import { Component, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignInComponent {
  showPassword = signal(false);
  isLoading = signal(false);
  errorUsuarioNoExiste = signal(false);
  errorPassIncorrecta = signal(false);
  errorGeneral = signal(false);

  usuario = new FormControl('', Validators.required);
  contrasena = new FormControl('', Validators.required);

  loginForm = new FormGroup({
    usuario: this.usuario,
    contrasena: this.contrasena,
  });

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  clearErrors(): void {
    this.errorUsuarioNoExiste.set(false);
    this.errorPassIncorrecta.set(false);
    this.errorGeneral.set(false);

    this.usuario.setErrors(null);
    this.contrasena.setErrors(null);
  }

  async handleSubmit(): Promise<void> {
    this.clearErrors();
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) return;

    this.isLoading.set(true);

    const username = this.usuario.value!.trim();
    const pass = this.contrasena.value!;

    const result = await this.authService.login(username, pass);

    this.isLoading.set(false);

    if (!result.ok) {
      if (result.reason === 'user-not-found') {
        this.errorUsuarioNoExiste.set(true);
        this.usuario.setErrors({ userNotFound: true });
        this.toastService.show('El usuario no existe');
        return;
      }

      if (result.reason === 'wrong-password') {
        this.errorPassIncorrecta.set(true);
        this.contrasena.setErrors({ wrongPassword: true });
        this.toastService.show('Contraseña incorrecta');
        return;
      }

      if (result.reason === 'too-many-requests') {
        this.errorGeneral.set(true);
        this.toastService.show('Demasiados intentos. Inténtalo más tarde');
        return;
      }

      this.errorGeneral.set(true);
      this.toastService.show('No se pudo iniciar sesión');
      return;
    }

    this.toastService.show('¡Bienvenido!');

    const redirect = sessionStorage.getItem('redirectAfterLogin');

    if (redirect) {
      sessionStorage.removeItem('redirectAfterLogin');
      this.router.navigateByUrl(redirect);
    } else {
      this.router.navigate(['']);
    }
  }
}
