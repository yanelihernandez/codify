import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true
})
export class HeaderComponent {

  dropdownVisible = signal(false);

  constructor(
    public authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  toggleDropdown(): void {
    this.dropdownVisible.update(v => !v);
  }

  logout(): void {
    const nombre = this.authService.authState().fullName;
    this.authService.logout();
    this.dropdownVisible.set(false);
    this.toastService.show(`¡Hasta pronto, ${nombre}!`);
    this.router.navigate(['/']);
  }

  // Cerrar dropdown al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile')) {
      this.dropdownVisible.set(false);
    }
  }
}

