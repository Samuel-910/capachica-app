import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { SlidersService } from '../../core/services/sliders.service';

import { initFlowbite } from 'flowbite';
import { register } from 'swiper/element/bundle';

// Registrar componentes personalizados de Swiper (solo si los usas en HTML)
register();

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit {
  sliders: any[] = [];
  emprendimientos: any[] = [];
  platosTipicos: any[] = [];
  paquetes: any[] = [];

  constructor(
    private emprendimientoService: EmprendimientoService,
    private slidersService: SlidersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarSliders();
  }


  cargarSliders(): void {
    this.slidersService.listarSliders().subscribe({
      next: (res) => {
        this.sliders = res.data ?? res;
  
        // Esperar a que Angular renderice los elementos del DOM
        setTimeout(() => {
          initFlowbite(); // Inicializa carrusel correctamente
        }, 0);
      },
      error: (err) => {
        console.error('Error al cargar sliders:', err);
      }
    });
  }
  
}
