import { Component, HostListener, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { CommonModule } from '@angular/common';
import { TiposServicioService } from '../../core/services/tipos-servicios.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  tiposServicio: any[] = [];

  constructor(private tiposServicioService: TiposServicioService) {}
  ocultarNav = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.ocultarNav = window.scrollY > 100;
  }
  
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      initFlowbite();
      this.cargarTiposServicio();
    }
  }
  cargarTiposServicio(): void {
    this.tiposServicioService.listarTiposServicio().subscribe({
      next: (data) => {
        this.tiposServicio = data; // o simplemente res si no hay wrapper
      },
      error: (err) => {
        console.error('Error al cargar tipos de servicio:', err);
      }
    });
  }

}