import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
    constructor(private authService : AuthService, private router: Router) {}
  logout(): void {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Cierre de sesión exitoso');
        localStorage.removeItem('authToken'); // Elimina el token de localStorage
        this.router.navigate(['/']); // Redirige al login
      },
      (error) => {
        console.error('Error al cerrar sesión', error);
      }
    );
  }

}
