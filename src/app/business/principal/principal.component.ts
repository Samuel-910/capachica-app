import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { NavbarComponent } from '../navbar/navbar.component';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { Router } from '@angular/router';

// register Swiper custom elements
register();
@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit{
  emprendimientos: any[] = [];

  constructor(private emprendimientoService:EmprendimientoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarEmprendimientos();
  }

  cargarEmprendimientos(): void {
    this.emprendimientoService.listarEmprendimientos({ page: 1, limit: 10 }).subscribe({
      next: (data) => {
        this.emprendimientos = data.emprendimientos;  // 👈 Aquí está el cambio
        console.log('Emprendimientos cargados:', this.emprendimientos);
      },
      error: (err) => {
        console.error('Error al cargar emprendimientos:', err);
      }
    });

  }
  irADetalles(id: number) {
    this.router.navigate(['/detalles', id]);
  }
}
