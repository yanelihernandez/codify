import { Component, OnInit, signal } from '@angular/core';
import { Professor } from '../../models/professor';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProfessorService } from '../../services/professors.service';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast.service';
import { BookingService } from '../../services/booking.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './booking.html',
  styleUrl: './booking.css'
})
export class Booking implements OnInit {
  professor = signal<Professor | null>(null);
  bookingForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private service: ProfessorService,
    private authService: AuthService,
    private toastService: ToastService,
    private bookingService: BookingService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkLogin();
    this.loadProfessor();
  }

  private initForm(): void {
    this.bookingForm = this.fb.group({
      fullName: ['', Validators.required],
      date: ['', [Validators.required, this.fechaPasadaValidator]],
      time: ['', Validators.required],
      hours: ['', Validators.required],
      isGroup: [false]
    });
  }

  private checkLogin(): void {
    const auth = this.authService.authState();
    const id = this.route.snapshot.paramMap.get('id');

    if (!auth.loggedIn) {
      this.toastService.show('Debes iniciar sesión para reservar una clase');

      if (id) {
        sessionStorage.setItem('redirectAfterLogin', `/booking/${id}`);
      }

      this.router.navigate(['/sign-in']);
    }
  }

  private loadProfessor(): void {
    const profId = this.route.snapshot.paramMap.get('id');

    if (!profId) {
      this.professor.set(null);
      return;
    }

    this.service.getProfessors().subscribe({
      next: (profs) => {
        const foundProfessor = profs.find(
          (p) => p.id.toString() === profId
        );

        this.professor.set(foundProfessor ?? null);
      },
      error: () => {
        this.professor.set(null);
        this.toastService.show('No se pudo cargar el profesor');
      }
    });
  }

  fechaPasadaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const fechaSeleccionada = new Date(control.value);
    fechaSeleccionada.setHours(0, 0, 0, 0);

    return fechaSeleccionada < hoy ? { fechaPasada: true } : null;
  }

  get fullName() {
    return this.bookingForm.get('fullName')!;
  }

  get date() {
    return this.bookingForm.get('date')!;
  }

  get time() {
    return this.bookingForm.get('time')!;
  }

  get hours() {
    return this.bookingForm.get('hours')!;
  }

  get isGroup() {
    return this.bookingForm.get('isGroup')!;
  }

  onGroupChange(): void {
    console.log('Modalidad cambiada a grupo:', this.isGroup.value);
    // Forzar actualización del precio
    this.precio();
  }

  precio(): number {
    const prof = this.professor();
    if (!prof) return 0;

    const horas = this.hours.value;
    if (!horas) return 0;

    const horasNum = Number(horas);
    if (isNaN(horasNum) || horasNum <= 0) return 0;

    const precioHora = Number(prof.hour_price);
    if (isNaN(precioHora)) return 0;

    let total = precioHora * horasNum;

    // Aplicar descuento si es grupo
    if (this.isGroup.value === true) {
      let descuento = Number(prof.group_discount);
      if (isNaN(descuento)) descuento = 0;

      if (descuento > 0) {
        total = total * (1 - descuento / 100);
        console.log(`Descuento aplicado: ${descuento}% -> Total: ${total}`);
      }
    }

    console.log('Precio calculado:', total);
    return Math.round(total);
  }

  handleSubmit(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      this.toastService.show('Revisa los campos obligatorios');
      return;
    }

    const prof = this.professor();

    if (!prof) {
      this.toastService.show('No se ha podido identificar al profesor');
      return;
    }

    const auth = this.authService.authState();
    if (!auth.loggedIn || !auth.username) {
      this.toastService.show('Debes iniciar sesión para reservar');
      this.router.navigate(['/sign-in']);
      return;
    }

    console.log('=== CREANDO RESERVA ===');
    console.log('Usuario:', auth.username);
    console.log('Profesor:', prof.name);
    console.log('Precio por hora:', prof.hour_price);
    console.log('Descuento grupo:', prof.group_discount);
    console.log('Horas:', this.hours.value);
    console.log('Es grupo:', this.isGroup.value);
    console.log('Precio final:', this.precio());
    console.log('========================');

    this.bookingService.createBooking({
      userId: auth.username,
      professorId: prof.id,
      professorName: prof.name,
      professorImage: prof.image,
      fullName: this.fullName.value,
      date: this.date.value,
      time: this.time.value,
      hours: Number(this.hours.value),
      isGroup: !!this.isGroup.value,
      price: this.precio()
    });

    this.toastService.show('Reserva realizada correctamente');
    this.router.navigate(['/my-bookings']);
  }
}
