import { Component, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../services/auth';
import { ToastService } from '../../services/toast.service';

function fechaNacimientoValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value?.trim();
  if (!value) return null;

  const partes = value.split('-');
  if (partes.length !== 3 || partes[2].length < 4) {
    return { formatoFecha: true };
  }

  const fechaNac = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  if (isNaN(fechaNac.getTime())) return { fechaInvalida: true };

  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();

  if (
    hoy.getMonth() < fechaNac.getMonth() ||
    (hoy.getMonth() === fechaNac.getMonth() &&
      hoy.getDate() < fechaNac.getDate())
  ) {
    edad--;
  }

  return edad < 18 ? { menorEdad: true } : null;
}

function minLengthPassword(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  return value.length < 8 ? { minLengthPass: true } : null;
}

function passwordsCoinciden(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('contrasena')?.value;
  const repPass = group.get('repContrasena')?.value;

  return repPass && pass !== repPass ? { passwordsMismatch: true } : null;
}

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUpComponent {
  showPassword = signal(false);
  showRepPassword = signal(false);
  isLoading = signal(false);
  progreso = signal(0);

  nombre = new FormControl('', Validators.required);
  apellidos = new FormControl('', Validators.required);
  fechaNacimiento = new FormControl('', [
    Validators.required,
    fechaNacimientoValidator,
  ]);
  username = new FormControl('', Validators.required);
  email = new FormControl('', [Validators.required, Validators.email]);
  contrasena = new FormControl('', [Validators.required, minLengthPassword]);
  repContrasena = new FormControl('', Validators.required);

  signUpForm = new FormGroup(
    {
      nombre: this.nombre,
      apellidos: this.apellidos,
      fechaNacimiento: this.fechaNacimiento,
      username: this.username,
      email: this.email,
      contrasena: this.contrasena,
      repContrasena: this.repContrasena,
    },
    { validators: passwordsCoinciden }
  );

  progresoColor = () => (this.progreso() === 100 ? '#25510a' : '#87ab69');

  mensajeEdad = () => {
    const value = this.fechaNacimiento.value?.trim();

    if (!value || !this.fechaNacimiento.touched) return null;
    if (this.fechaNacimiento.hasError('formatoFecha')) return null;
    if (this.fechaNacimiento.hasError('fechaInvalida')) return null;

    if (this.fechaNacimiento.hasError('menorEdad')) {
      return {
        texto: '✗ Eres menor de edad, no puedes registrarte',
        tipo: 'no',
      };
    }

    return {
      texto: '✓ Eres mayor de edad, puedes registrarte',
      tipo: 'ok',
    };
  };

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    [
      this.nombre,
      this.apellidos,
      this.fechaNacimiento,
      this.username,
      this.email,
      this.contrasena,
      this.repContrasena,
    ].forEach((ctrl) =>
      ctrl.valueChanges.subscribe(() => this.actualizarProgreso())
    );

    this.actualizarProgreso();
  }

  private actualizarProgreso(): void {
    const campos = [
      this.nombre.value,
      this.apellidos.value,
      this.fechaNacimiento.value,
      this.username.value,
      this.email.value,
      this.contrasena.value,
      this.repContrasena.value,
    ];

    const rellenos = campos.filter(
      (v) => typeof v === 'string' && v.trim() !== ''
    ).length;

    this.progreso.set((rellenos / campos.length) * 100);
  }

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  toggleRepPassword(): void {
    this.showRepPassword.update((v) => !v);
  }

  async handleSubmit(): Promise<void> {
    this.signUpForm.markAllAsTouched();

    if (this.signUpForm.invalid) return;

    const nombre = this.nombre.value!.trim();
    const apellidos = this.apellidos.value!.trim();
    const fechaNacimiento = this.fechaNacimiento.value!.trim();
    const username = this.username.value!.trim();
    const email = this.email.value!.trim().toLowerCase();
    const pass = this.contrasena.value!;

    this.isLoading.set(true);

    const nuevoUsuario: User = {
      name: nombre,
      surnames: apellidos,
      fullName: `${nombre} ${apellidos}`.trim(),
      birthdate: fechaNacimiento,
      username,
      email,
      moreInfo: 'Usuario registrado',
    };

    const result = await this.authService.registerUser(nuevoUsuario, pass);

    this.isLoading.set(false);

    if (!result.ok) {
      if (result.reason === 'username-taken') {
        this.username.setErrors({ usernameTaken: true });
        this.toastService.show('El nombre de usuario ya está registrado');
        return;
      }

      if (result.reason === 'email-already-in-use') {
        this.email.setErrors({ emailTaken: true });
        this.toastService.show('Ese email ya está registrado');
        return;
      }

      if (result.reason === 'weak-password') {
        this.contrasena.setErrors({ weakPassword: true });
        this.toastService.show('La contraseña debe tener al menos 8 caracteres');
        return;
      }

      if (result.reason === 'invalid-email') {
        this.email.setErrors({ invalidEmail: true });
        this.toastService.show('El email no es válido');
        return;
      }

      this.toastService.show('No se pudo completar el registro');
      return;
    }

    this.toastService.show('Registro completado. Ahora inicia sesión');
    this.router.navigate(['/sign-in']);
  }
}
