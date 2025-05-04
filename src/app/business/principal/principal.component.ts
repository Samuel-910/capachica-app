import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnInit } from '@angular/core';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { NavbarComponent } from '../navbar/navbar.component';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { Router, RouterModule } from '@angular/router';

// register Swiper custom elements
register();
@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NavbarComponent,RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit{


  emprendimientos: any[] = [];
  platosTipicos: any[] = [];
  paquetes: any[] = [];
  constructor(private emprendimientoService:EmprendimientoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarEmprendimientos();
    this.cargarPlatosTipicos();
    this.cargarPaquetes();
  }
  cargarPlatosTipicos(): void {
    // Simulamos una respuesta desde el servicio
    const simulatedData = {
      platos_tipicos: [
        {
          id: 1,
          nombre: "Ceviche",
          descripcion: "Plato de pescado o mariscos frescos, marinados en jugo de limón, con cebolla, cilantro y ají.",
          ingredientes: ["Pescado fresco", "Cebolla", "Cilantro", "Limón", "Ají"],
          region: "Costa",
          origen: "Perú",
          tipo: "Entrada"
        },
        {
          id: 2,
          nombre: "Lomo Saltado",
          descripcion: "Plato con carne de res salteada con cebolla, tomate, ají amarillo y servido con papas fritas y arroz.",
          ingredientes: ["Carne de res", "Cebolla", "Tomate", "Ají amarillo", "Papas fritas", "Arroz"],
          region: "Sierra",
          origen: "Perú",
          tipo: "Plato principal"
        },
        {
          id: 3,
          nombre: "Aji de Gallina",
          descripcion: "Plato a base de pechuga de pollo desmenuzada, salsa cremosa de ají amarillo, con arroz blanco.",
          ingredientes: ["Pollo", "Ají amarillo", "Leche evaporada", "Pan", "Nuez moscada"],
          region: "Sierra",
          origen: "Perú",
          tipo: "Plato principal"
        },
        {
          id: 4,
          nombre: "Causa Limeña",
          descripcion: "Plato frío de puré de papa amarilla sazonado con ají, limón y relleno de atún o pollo.",
          ingredientes: ["Papa amarilla", "Ají", "Limón", "Atún", "Mayonesa"],
          region: "Costa",
          origen: "Perú",
          tipo: "Entrada"
        },
        {
          id: 5,
          nombre: "Pachamanca",
          descripcion: "Carne, papas, habas y maíz cocidos bajo tierra con hierbas aromáticas, típico de los Andes.",
          ingredientes: ["Carne de cerdo", "Papas", "Habas", "Maíz", "Hierbas aromáticas"],
          region: "Andina",
          origen: "Perú",
          tipo: "Plato principal"
        }
      ]
    };

    // Simula la respuesta exitosa
    this.platosTipicos = simulatedData.platos_tipicos;
    console.log('Platos típicos cargados:', this.platosTipicos);
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
    this.paquetes = simulatedData.paquetes;
    console.log('Platos típicos cargados:', this.paquetes);
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
