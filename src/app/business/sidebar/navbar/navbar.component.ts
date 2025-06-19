import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellidos: string;
  // …otros campos si los tienes…
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  usuario: Usuario | null = null;
  nombreCompleto = '';
  iniciales = '';
ngOnInit(): void {
  const raw = localStorage.getItem('usuario');
  if (raw) {
    this.usuario = JSON.parse(raw);
  }

  if (this.usuario) {
    this.nombreCompleto = `${this.usuario.nombre} ${this.usuario.apellidos}`;
    this.iniciales    = this.generarIniciales(this.usuario.nombre, this.usuario.apellidos);
  }
}

  private generarIniciales(nombre: string, apellidos: string): string {
    const primeraLetraNombre = nombre.charAt(0) || '';
    const primeraLetraApellido = apellidos.charAt(0) || '';
    return (primeraLetraNombre + primeraLetraApellido).toUpperCase();
  }
}
