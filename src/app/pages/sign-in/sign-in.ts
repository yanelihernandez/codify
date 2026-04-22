import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignInComponent {
  showPassword = signal(false);
  isLoading = signal(false);
  errorUsuarioNoExiste = signal(false);
  errorPassIncorrecta = signal(false);

  usuario = new FormControl('', Validators.required);
  contrasena = new FormControl('', Validators.required);

  loginForm = new FormGroup({
    usuario: this.usuario,
    contrasena: this.contrasena
  });

  constructor(private authService: AuthService, private toastService: ToastService, private router: Router) {}

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  clearErrors(): void {
    this.errorUsuarioNoExiste.set(false);
    this.errorPassIncorrecta.set(false);
  }

  async handleSubmit(): Promise<void> {
    this.clearErrors();
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    const username = this.usuario.value!.trim();
    const pass = this.contrasena.value!.trim();
    const usuarioEncontrado = await this.authService.findUser(username);

    setTimeout(() => {
      this.isLoading.set(false);

      if (!usuarioEncontrado) {
        this.errorUsuarioNoExiste.set(true);
        this.usuario.setErrors({ notFound: true });
        this.toastService.show('El usuario no existe');
        return;
      }

      if (usuarioEncontrado.password !== pass) {
        this.errorPassIncorrecta.set(true);
        this.contrasena.setErrors({ wrongPassword: true });
        this.toastService.show('Contraseña incorrecta');
        return;
      }

      this.authService.setAuth({
        loggedIn: true,
        username: usuarioEncontrado.username,
        fullName: usuarioEncontrado.fullName,
        nombre: usuarioEncontrado.nombre,
        apellidos: usuarioEncontrado.apellidos,
        fechaNacimiento: usuarioEncontrado.fechaNacimiento
      });

      this.toastService.show(`¡Bienvenido, ${usuarioEncontrado.username}!`);
      const redirect = sessionStorage.getItem('redirectAfterLogin');
      if (redirect) {
        sessionStorage.removeItem('redirectAfterLogin');
        this.router.navigateByUrl(redirect);
      } else {
        this.router.navigate(['/']);
      }
    }, 800);
  }
}
