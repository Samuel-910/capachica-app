import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from '../../navbar/navbar.component';
import { EmprendimientoService } from '../../../core/services/emprendimiento.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { LugaresService } from '../../../core/services/lugar.service';
import { ServiciosService } from '../../../core/services/servicios.service'; // <-- Importa el servicio que maneja los servicios

import { HttpClient } from '@angular/common/http';
import { NuevaResena, Resena, ResenasService } from '../../../services/resenas.service';

@Component({
  selector: 'app-detprin-emprendimiento',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './detemprendimiento.component.html',
  styleUrls: ['./detemprendimiento.component.css']
})
export class DetprinEmprendimientoComponent implements OnInit {
  mapUrl!: SafeResourceUrl;
  emprendimiento: any = {};
  lugaresTuristicos: any[] = [];
  servicios: any[] = [];
  serviciosFiltrados: any[] = [];
  isLoading = true;
  errorMessage = '';
  dateForm: FormGroup;
  nights: number | null = null;
  totalPrice: number | null = null;
  currentSlide = 0;
  resenas: Resena[] = [];
  promedioCalificacion: number = 0;
  servicioId: number = 0;
  mostrarFormulario: boolean = false;
  resenaForm: FormGroup;
  expandedComments: Set<number> = new Set(); // Para rastrear qué comentarios están expandidos
  currentYear: number = new Date().getFullYear();

  constructor(
    private route: ActivatedRoute,
    private empService: EmprendimientoService,
    private lugarService: LugaresService,
    private serviciosService: ServiciosService,  // <-- Inyecta el servicio de servicios
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private resenasService: ResenasService,
    private http: HttpClient
  ) {
    this.dateForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      numeroPersonas: [1]
    });

    this.dateForm.valueChanges.subscribe(values => {
      this.calculateNights(values.startDate, values.endDate);
    });

    this.resenaForm = this.fb.group({
      calificacion: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comentario: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    initFlowbite();

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'ID de emprendimiento no proporcionado';
      this.isLoading = false;
      return;
    }

    // 1) Traemos el detalle del emprendimiento
    this.empService.verEmprendimiento(id).subscribe({
      next: detalle => {
        this.emprendimiento = detalle;
        this.isLoading = false;

        // Cargar lugar turístico relacionado
        if (detalle.lugarTuristicoId) {
          this.lugarService.getLugar(detalle.lugarTuristicoId).subscribe({
            next: lugar => {
              this.emprendimiento.lugarTuristico = lugar;
            },
            error: err => console.error('Error cargando lugar turístico', err)
          });
        }

        // Construimos el mapa si tiene coordenadas
        if (detalle.latitud && detalle.longitud) {
          this.buildMapUrl(detalle.latitud, detalle.longitud);
        }

        // Cargar servicios relacionados al emprendimiento
        this.cargarServiciosRelacionados(detalle.id);
      },
      error: err => {
        console.error('Error cargando emprendimiento:', err);
        this.errorMessage = 'No se pudo cargar el emprendimiento.';
        this.isLoading = false;
      }
    });
    

    // 2) Traemos TODOS los lugares turísticos
    this.lugarService.getLugares().subscribe({
      next: lugares => {
        this.lugaresTuristicos = lugares;
      },
      error: err => {
        console.error('Error al cargar todos los lugares turísticos', err);
      }
    });

    // Obtener el ID del servicio de los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.servicioId = +params['id']; // El + convierte el string a número
      this.cargarResenas();
    });
  }

  private cargarServiciosRelacionados(emprendimientoId: string) {
    this.serviciosService.listarServicios().subscribe({
      next: servicios => {
        // Filtrar servicios que pertenezcan al emprendimiento actual
        this.servicios = servicios.filter((servicio: any) =>
          servicio.serviciosEmprendedores?.some((emp: any) =>
            emp.emprendimientoId === emprendimientoId
          )
        );
        this.serviciosFiltrados = [...this.servicios];
      },
      error: err => {
        console.error('Error al cargar servicios:', err);
        Swal.fire('Error', 'No se pudieron cargar los servicios relacionados', 'error');
      }
    });
  }

  private calculateNights(startDate: string, endDate: string): void {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = end.getTime() - start.getTime();
      this.nights = diff / (1000 * 3600 * 24);
      if (this.nights !== null && this.emprendimiento.precioBase) {
        this.totalPrice = this.nights * this.emprendimiento.precioBase;
      }
    } else {
      this.nights = null;
      this.totalPrice = null;
    }
  }

  prevSlide(): void {
    const len = this.emprendimiento.imagenes?.length || 0;
    this.currentSlide = len
      ? (this.currentSlide - 1 + len) % len
      : 0;
  }

  nextSlide(): void {
    const len = this.emprendimiento.imagenes?.length || 0;
    this.currentSlide = len
      ? (this.currentSlide + 1) % len
      : 0;
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  goToLugarTuristico(id: string): void {
    this.router.navigate(['/prinlugares', id]);
  }
  goToServicio(servicio: any): void {
    this.router.navigate(['/prinservicios/1', servicio.id]);
  }


  getIterable(val: any): any[] {
    return Array.isArray(val) ? val : [];
  }
  getServiciosPorTipo(tipoId: number) {
    return this.serviciosFiltrados.filter(s => s.tipoServicioId === tipoId);
  }

  private buildMapUrl(lat: number, lng: number): void {
    const url = `https://maps.google.com/maps?q=${lat},${lng}&z=13&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  cargarResenas() {
    this.resenasService.getAllResenas().subscribe({
      next: (resenas) => {
        this.resenas = resenas;
        this.calcularPromedioCalificacion();
      },
      error: (error) => {
        console.error('Error al cargar las reseñas:', error);
      }
    });
  }

  calcularPromedioCalificacion() {
    if (this.resenas.length === 0) {
      this.promedioCalificacion = 0;
      return;
    }
    const suma = this.resenas.reduce((acc, resena) => acc + resena.calificacion, 0);
    this.promedioCalificacion = suma / this.resenas.length;
  }

  getEstrellas(calificacion: number): number[] {
    return Array(Math.floor(calificacion)).fill(0);
  }

  getEstrellasVacias(calificacion: number): number[] {
    return Array(5 - Math.floor(calificacion)).fill(0);
  }

  // Método para obtener el nombre del servicio según el ID
  getNombreServicio(servicioId: number): string {
    switch (servicioId) {
      case 1:
        return 'Tour en Kayak';
      case 2:
        return 'Almuerzo Tradicional';
      case 3:
        return 'Habitación Doble';
      case 4:
        return 'Guía Turístico';
      case 5:
        return 'Transporte a Islas Uros';
      default:
        return 'Servicio';
    }
  }

  setCalificacion(valor: number) {
    this.resenaForm.patchValue({ calificacion: valor });
  }

  enviarResena() {
    if (this.resenaForm.valid) {
      // Verificar si el usuario está autenticado
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Debes iniciar sesión para dejar una reseña',
          confirmButtonText: 'Ir a iniciar sesión'
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/login']);
          }
        });
        return;
      }

      const servicioId = this.route.snapshot.paramMap.get('id');

      if (!servicioId) {
        console.error('No se encontró el ID del servicio');
        return;
      }

      const nuevaResena: NuevaResena = {
        servicioId: parseInt(servicioId),
        calificacion: this.resenaForm.get('calificacion')?.value,
        comentario: this.resenaForm.get('comentario')?.value
      };

      this.resenasService.crearResena(nuevaResena).subscribe({
        next: (resena) => {
          Swal.fire({
            icon: 'success',
            title: '¡Gracias por tu reseña!',
            text: 'Tu reseña ha sido publicada exitosamente.',
            confirmButtonText: 'Aceptar'
          });
          this.resenas.unshift(resena);
          this.calcularPromedioCalificacion();
          this.mostrarFormulario = false;
          this.resenaForm.reset();
        },
        error: (error) => {
          console.error('Error al crear la reseña:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo publicar tu reseña. Por favor, intenta nuevamente.',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }

  toggleComment(resenaId: number) {
    if (this.expandedComments.has(resenaId)) {
      this.expandedComments.delete(resenaId);
    } else {
      this.expandedComments.add(resenaId);
    }
  }

  isCommentExpanded(resenaId: number): boolean {
    return this.expandedComments.has(resenaId);
  }
}