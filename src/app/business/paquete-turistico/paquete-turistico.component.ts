import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NavbarComponent } from '../sidebar/navbar/navbar.component';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paquete-turistico',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, CommonModule, RouterModule],
  templateUrl: './paquete-turistico.component.html',
  styleUrl: './paquete-turistico.component.css'
})
export class PaqueteTuristicoComponent {
    paquetes: any[] = [];
    paginaActual: number = 1;
    totalPaginas: number = 1;
    totalElementos: number = 0;
    limitePorPagina: number = 10;
    constructor(private router: Router) {}
    ngOnInit(): void {
      this.cargarPaquetes();
    }
  cargarPaquetes(): void {
    const simulatedData = {
      paquetes: [
        {
          id: 1,
          titulo: "Paquete Paramis",
          icono: "fa-solid fa-bookmark",
          logo: "https://img.icons8.com/ios-filled/50/wifi-logo.png",
          precio: "s/ 132.50",
          estrellas: 4,
          lugares_visitar: [
            "Centro Ceremonial Pachatata",
            "Rechamama"
          ],
          servicios_adicionales: [
            "Relacionado con servicios_id"
          ],
          incluye: [
            "✅ Servicio a Habitación",
            "✅ Paseos Guados"
          ],
          no_incluye: [
            "❌ Altruarzos"
          ],
          politicas_cancelacion: "Cancelación de un servicio que más de 30 meses al día de participación a la fecha de juicio del paquete. Excambiado del 107% del paseo pagado.",
          requisitos: [
            "Buena Condición Física",
            "Traer Artículo Valioso"
          ]
        },
        {
          id: 2,
          titulo: "Paquete Andino",
          icono: "fa-solid fa-mountain",
          logo: "https://img.icons8.com/ios-filled/50/mountain.png",
          precio: "s/ 200.00",
          estrellas: 5,
          lugares_visitar: [
            "Machu Picchu",
            "Sacsayhuamán",
            "Valle Sagrado"
          ],
          servicios_adicionales: [
            "Excursión guiada",
            "Transporte privado"
          ],
          incluye: [
            "✅ Alojamiento 3 noches",
            "✅ Entradas a Machu Picchu",
            "✅ Transporte a todos los lugares"
          ],
          no_incluye: [
            "❌ Alimentos fuera del paquete"
          ],
          politicas_cancelacion: "Cancelación 100% reembolsable hasta 15 días antes de la fecha de inicio.",
          requisitos: [
            "Pasaporte válido",
            "Ropa cómoda"
          ]
        },
        {
          id: 3,
          titulo: "Paquete Amazonía",
          icono: "fa-solid fa-leaf",
          logo: "https://img.icons8.com/ios-filled/50/leaf.png",
          precio: "s/ 250.00",
          estrellas: 4,
          lugares_visitar: [
            "Reserva Nacional Pacaya Samiria",
            "Río Amazonas"
          ],
          servicios_adicionales: [
            "Guía naturalista",
            "Transporte fluvial"
          ],
          incluye: [
            "✅ Alojamiento en eco-lodge",
            "✅ Excursión en bote",
            "✅ Todas las comidas durante el tour"
          ],
          no_incluye: [
            "❌ Bebidas alcohólicas"
          ],
          politicas_cancelacion: "Cancelación parcial, se reembolsará el 50% si se cancela con 7 días de antelación.",
          requisitos: [
            "Vacunas recomendadas",
            "Traer repelente para mosquitos"
          ]
        },
        {
          id: 4,
          titulo: "Paquete Cultural Lima",
          icono: "fa-solid fa-city",
          logo: "https://img.icons8.com/ios-filled/50/city.png",
          precio: "s/ 180.00",
          estrellas: 4,
          lugares_visitar: [
            "Plaza Mayor de Lima",
            "Museo Larco",
            "Barranco"
          ],
          servicios_adicionales: [
            "Tour guiado",
            "Transporte privado"
          ],
          incluye: [
            "✅ Entradas a todos los museos",
            "✅ Almuerzo tradicional",
            "✅ Transporte durante el recorrido"
          ],
          no_incluye: [
            "❌ Souvenirs"
          ],
          politicas_cancelacion: "No reembolsable si se cancela con menos de 72 horas de antelación.",
          requisitos: [
            "Cámara fotográfica",
            "Ropa cómoda"
          ]
        }
      ]
    };
    this.paquetes = simulatedData.paquetes;
    console.log('Platos típicos cargados:', this.paquetes);
  }
  editar(ip: string): void {
    // Aquí puedes trabajar con la IP recibida como parámetro
    console.log('Editando plato con IP:', ip);

    // Lógica para redirigir o realizar la edición según la IP
    // Si quieres navegar a una página de edición, por ejemplo:
    this.router.navigate(['/editpaquetes', ip]); // Redirige a la página de edición, pasando la IP en la URL
  }
      eliminar(id: number): void {
        Swal.fire({
          title: '¿Estás seguro?',
          text: '¡Esta acción no se puede deshacer!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
          if (result.isConfirmed) {

          }
        });
      }
      paginaSiguiente(): void {
        if (this.paginaActual < this.totalPaginas) {
          this.paginaActual++;
          this.cargarPaquetes();
        }
      }
      paginaAnterior(): void {
        if (this.paginaActual > 1) {
          this.paginaActual--;
          this.cargarPaquetes();
        }
      }
      getLimiteSuperior(): number {
        return Math.min(this.paginaActual * this.limitePorPagina, this.totalElementos);
      }
}
