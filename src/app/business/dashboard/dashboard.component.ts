import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private router: Router) {}

  logout() {
    // Lógica para cerrar sesión (como limpiar almacenamiento local, etc.)
    
    // Redirigir al home después de hacer logout
    this.router.navigate(['/home']);
  }
}
