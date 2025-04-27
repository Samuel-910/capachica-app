import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paquetedet',
  standalone: true,
  imports: [NavbarComponent, CommonModule],
  templateUrl: './paquetedet.component.html',
  styleUrl: './paquetedet.component.css'
})
export class PaquetedetComponent implements OnInit{
  currentPaquete: any = null;
  constructor(
        private router: Router,
        private route: ActivatedRoute,  // Inyectamos ActivatedRoute para acceder a los parámetros de la URL
        // private platoService: PlatoService
      ) {};
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
        },
        {
          id: 5,
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
        }
      ]
    };
    const id = this.route.snapshot.paramMap.get('id');
    const paquetes = simulatedData.paquetes.find(p => p.id.toString() === id);
    this.currentPaquete = paquetes;
  }
}
