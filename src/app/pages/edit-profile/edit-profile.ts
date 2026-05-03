import { Component, signal, computed, OnInit } from '@angular/core';
import {
  FormGroup, FormControl, Validators,
  AbstractControl, ValidationErrors, ReactiveFormsModule
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService, User} from '../../services/auth';
import { ToastService } from '../../services/toast.service';

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

  async ngOnInit(): Promise<void> {
    const user = await this.authService.getCurrentUser();

    if (user) {
      this.nombre.setValue(user.name ?? '');
      this.apellidos.setValue(user.surnames ?? '');
      this.fechaNacimiento.setValue(user.birthdate ?? '');
      this.username.setValue(user.username ?? '');
      if (user.birthdate) this.fechaNacimiento.markAsTouched();
    }
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleRepPassword(): void {
    this.showRepPassword.update(v => !v);
  }

  async handleSubmit(): Promise<void> {
    const user = await this.authService.getCurrentUser();
    if(!user) return;

    this.editForm.markAllAsTouched();
    if (this.editForm.invalid) {
      this.toastService.show('Revisa los campos');
      return;
    }

    this.isLoading.set(true);

    const nombre = this.nombre.value!.trim();
    const apellidos = this.apellidos.value!.trim();
    const fechaNacimiento = this.fechaNacimiento.value!;
    const username = this.username.value!.trim();

    const updatedUser: User = {
      name: nombre,
      surnames: apellidos,
      fullName: `${nombre} ${apellidos}`.trim(),
      birthdate: fechaNacimiento,
      username: username,
      email: user.email,
      moreInfo: 'Usuario actualizado'
    };

    const ok = await this.authService.updateUser(updatedUser);

    this.isLoading.set(false);

    if (!ok) {
      this.toastService.show('Error al actualizar');
      return;
    }

    this.toastService.show('Perfil actualizado');
    this.router.navigate(['/profile']);
  }
}
