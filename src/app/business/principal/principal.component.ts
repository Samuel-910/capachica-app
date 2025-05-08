import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { SlidersService } from '../../core/services/sliders.service';

import { initFlowbite } from 'flowbite';
import { register } from 'swiper/element/bundle';
import { ServiciosService } from '../../core/services/servicios.service';
import { PaqueteTuristicoService } from '../../core/services/paquetes-turisticos.service';
import { ResenaService } from '../../core/services/resenas.service';
import Swal from 'sweetalert2';

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
  paquetesTuristicos: any[] = []; // Aquí almacenamos la lista de paquetes turísticos
  isLoading: boolean = false;
  serviciosAlojamiento: any[] = [];  // Variable para almacenar los servicios de alojamiento
  serviciosExperiencia: any[] = [];
  tipoServicioId: string = '';

  constructor(
    private slidersService: SlidersService,
    private servicioService: ServiciosService,
    private paqueteTuristicoService: PaqueteTuristicoService,
    private resenaService: ResenaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarSliders();
    this.obtenerServiciosConReseñas();
    this.obtenerServiciosPorTipoExperiencia();
    this.obtenerPaquetesTuristicos();
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
  obtenerServiciosConReseñas(): void {
    this.tipoServicioId = '3';
    this.isLoading = true; // Indicamos que estamos cargando los datos
    this.servicioService.listarServiciosPorTipo(this.tipoServicioId).subscribe((res: any) => {
      this.serviciosAlojamiento = res;

      // Para cada servicio, obtenemos el promedio de calificación y las reseñas
      this.serviciosAlojamiento.forEach(servicio => {
        // Obtener el promedio de calificación
        this.resenaService.obtenerPromedioDeCalificacion(servicio.id).subscribe((promedio: any) => {
          servicio.promedioCalificacion = promedio.promedioCalificacion; // Asignamos el promedio
          servicio.totalResenas = promedio.totalResenas; // Asignamos el total de reseñas
        });

        // Obtener las reseñas
        this.resenaService.obtenerReseñas().subscribe((reseñas: any) => {
          servicio.reseñas = reseñas.filter((resena: any) => resena.servicioId === servicio.id);
        });
      });

      this.isLoading = false; // Terminamos de cargar los datos
    });
  }
  
  obtenerServiciosPorTipoExperiencia(): void {
    this.tipoServicioId = '8';
    this.servicioService.listarServiciosPorTipo(this.tipoServicioId).subscribe(
      (res: any) => {
        console.log('Servicios por tipo Experiencia:', res);
        if (res) {
          this.serviciosExperiencia = res;  // Guarda los servicios de experiencia obtenidos
        } else {
          console.error('Error al obtener los servicios de Experiencia', res);
        }
      },
      error => {
        console.error('Error en la solicitud de servicios por tipo Experiencia', error);
      }
    );
  }
  obtenerPaquetesTuristicos(): void {
    this.isLoading = true; // Indicamos que la solicitud está en proceso
    this.paqueteTuristicoService.listarPaquetesTuristicos().subscribe(
      (res: any) => {
        this.paquetesTuristicos = res; // Guardamos la respuesta en la variable
        console.log('Paquetes turísticos obtenidos:', res);
      },
      (error) => {
        console.error('Error al obtener paquetes turísticos:', error);
      },
      () => {
        this.isLoading = false; // Indicamos que la solicitud ha finalizado
      }
    );
  }

  verDetallesPaquete(id: number): void {
    // Redirige a la ruta con el parámetro de id
    this.router.navigate([`/paquetesdetalle/${id}`]); 
  }

  showPackageDetails(currentPaquete: any): void {
    Swal.fire({
      title: currentPaquete.nombre,
      html: `
        <div class="flex justify-center items-start pt-[100px] gap-8 mt-10 px-4">
          <div class="card" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; width: 98%; max-width: 1200px; margin: 20px auto; font-family: Arial, sans-serif; display: flex; gap: 15px; align-items: stretch; min-height: 200px;">
            <div style="flex: 0 0 45%; position: relative; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <img src="${currentPaquete.imagenes.length > 0 ? currentPaquete.imagenes[0] : 'img/fam1.png'}" alt="Paquete Paramis" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="flex: 1; padding: 10px 30px 10px 0; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <h1 style="margin: 0; font-size: 1.4rem; color: #2c3e50; display: flex; align-items: center;">
                    <i class="fa-solid fa-bookmark" style="margin-right: 8px; font-size: 1.3rem; color: #f39c12;"></i>
                    ${currentPaquete.nombre}
                  </h1>
                  <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/wifi-logo.png" alt="wifi-logo" style="margin-left: 80px; transform: translateY(-3px);" />
                </div>
                <div class="flex items-center" style="margin-top: 5px; font-size: 1.2rem; font-weight: bold; color: #2c3e50;">
                  Precio: S/${currentPaquete.precio} ${currentPaquete.moneda}
                </div>
  
                <div class="flex items-center">
                  <span class="text-yellow-300 mr-1" *ngFor="let star of [].constructor(currentPaquete.estrellas); let i = index">
                    <i class="fas fa-star"></i>
                  </span>
                  <span class="text-gray-300" *ngFor="let star of [].constructor(5 - currentPaquete.estrellas); let i = index">
                    <i class="fas fa-star"></i>
                  </span>
                </div>
              </div>
  
              <div>
                <h3 style="font-size: 1.1rem; color: #34495e;">Emprendimiento</h3>
                <p><strong>Nombre:</strong> ${currentPaquete.emprendimiento.nombre}</p>
                <p><strong>Descripción:</strong> ${currentPaquete.emprendimiento.descripcion}</p>
                <p><strong>Dirección:</strong> ${currentPaquete.emprendimiento.direccion}</p>
              </div>
  
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div>
                  <h2 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #34495e;">Lugares que Visitarás</h2>
                </div>
                <div>
                  <h2 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #34495e;">Servicios Adicionales</h2>
                </div>
              </div>
  
              <div style="border-top: 1px solid #ecf0f1; border-bottom: 1px solid #ecf0f1; padding: 15px 0; margin: 20px 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div>
                    <h3 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #27ae60;">INCLUYE:</h3>
                  </div>
                  <div>
                    <h3 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #c0392b;">NO INCLUYE:</h3>
                  </div>
                </div>
              </div>
  
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; padding-top: 15px;">
                <div>
                  <h2 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #34495e;">Políticas de Cancelación</h2>
                </div>
                <div>
                  <h2 style="margin: 0 0 10px 0; font-size: 1.1rem; color: #34495e;">Requisitos</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Cerrar',
    });
  }
  
}
