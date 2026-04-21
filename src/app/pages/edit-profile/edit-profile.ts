import { Component, signal, computed, OnInit } from '@angular/core';
import {
  FormGroup, FormControl, Validators,
  AbstractControl, ValidationErrors, ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

function fechaNacimientoValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value?.trim();
  if (!value) return null;

  const partes = value.split('-');
  if (partes.length !== 3 || partes[2].length < 4) return { formatoFecha: true };

  const fechaNac = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
  if (isNaN(fechaNac.getTime())) return { fechaInvalida: true };

  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  if (hoy.getMonth() < fechaNac.getMonth() ||
    (hoy.getMonth() === fechaNac.getMonth() && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  if (edad < 18) return { menorEdad: true };
  return null;
}

function minLengthPassword(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;
  return value.length < 8 ? { minLengthPass: true } : null;
}

function passwordsCoinciden(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('contrasena')?.value;
  const repPass = group.get('repContrasena')?.value;
  if (repPass && pass !== repPass) return { passwordsMismatch: true };
  return null;
}

@Component({
  selector: 'app-edit-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfileComponent implements OnInit {

  showPassword = signal(false);
  showRepPassword = signal(false);
  isLoading = signal(false);

  nombre = new FormControl('', Validators.required);
  apellidos = new FormControl('', Validators.required);
  fechaNacimiento = new FormControl('', [Validators.required, fechaNacimientoValidator]);
  username = new FormControl('', Validators.required);
  contrasena = new FormControl('', minLengthPassword);
  repContrasena = new FormControl('');

  editForm = new FormGroup({
    nombre: this.nombre,
    apellidos: this.apellidos,
    fechaNacimiento: this.fechaNacimiento,
    username: this.username,
    contrasena: this.contrasena,
    repContrasena: this.repContrasena
  }, { validators: passwordsCoinciden });

  mensajeEdad = computed(() => {
    const value = this.fechaNacimiento.value?.trim();
    if (!value || !this.fechaNacimiento.touched) return null;
    if (this.fechaNacimiento.hasError('formatoFecha') || this.fechaNacimiento.hasError('fechaInvalida')) return null;
    if (this.fechaNacimiento.hasError('menorEdad')) {
      return { texto: '✗ Eres menor de edad', tipo: 'no' };
    }
    return { texto: '✓ Eres mayor de edad', tipo: 'ok' };
  });

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const auth = this.authService.authState();
    if (!auth.loggedIn) {
      this.router.navigate(['/sign-in']);
      return;
    }

    const user = this.authService.getCurrentUser();
    if (user) {
      this.nombre.setValue(user.nombre ?? '');
      this.apellidos.setValue(user.apellidos ?? '');
      this.fechaNacimiento.setValue(user.fechaNacimiento ?? '');
      this.username.setValue(user.username ?? '');
      // Trigger edad feedback on load
      if (user.fechaNacimiento) this.fechaNacimiento.markAsTouched();
    }
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleRepPassword(): void {
    this.showRepPassword.update(v => !v);
  }

  handleSubmit(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) return;

    const nombre = this.nombre.value!.trim();
    const apellidos = this.apellidos.value!.trim();
    const fechaNac = this.fechaNacimiento.value!;
    const username = this.username.value!.trim();
    const pass = this.contrasena.value ?? '';

    this.isLoading.set(true);

    const auth = this.authService.authState();
    const currentUsername = auth.username!;

    const updatedUser = {
      nombre,
      apellidos,
      fullName: `${nombre} ${apellidos}`.trim(),
      fechaNacimiento: fechaNac,
      username,
      password: pass || '',
      masInfo: 'Usuario registrado'
    };

    const ok = this.authService.updateUser(currentUsername, updatedUser);

    if (!ok) {
      this.isLoading.set(false);
      this.toastService.show('Error al guardar los cambios');
      return;
    }

    this.authService.setAuth({
      loggedIn: true,
      username,
      fullName: updatedUser.fullName,
      nombre,
      apellidos,
      fechaNacimiento: fechaNac
    });

    this.toastService.show('Cambios guardados correctamente');
    setTimeout(() => this.router.navigate(['/profile']), 600);
  }
}
