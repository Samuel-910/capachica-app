import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  emprendimientos: any[] = [];
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Código que depende del DOM
      this.cargarEmprendimientos();
      initFlowbite();
    }
  }
    constructor(private emprendimientoService:EmprendimientoService) {}
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
}
