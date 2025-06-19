import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { NavbarComponent } from '../navbar/navbar.component';
import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { SlidersService } from '../../core/services/sliders.service';
import { ServiciosService } from '../../core/services/servicios.service';
import { PaqueteTuristicoService } from '../../core/services/paquetes-turisticos.service';
import { ResenaService } from '../../core/services/resenas.service';

import { initFlowbite } from 'flowbite';
import { register } from 'swiper/element/bundle';
import Swal from 'sweetalert2';

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { SupabaseService } from '../../core/services/supabase.service';

gsap.registerPlugin(ScrollTrigger);
register();

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent implements OnInit, AfterViewInit, OnDestroy {
  sliders: any[] = [];
  paquetesTuristicos: any[] = [];
  isLoading: boolean = false;
  serviciosAlojamiento: any[] = [];
  serviciosExperiencia: any[] = [];
  tipoServicioId: string = '';
  currentCarouselIndex = 0;
  carouselInterval: any;
  letters: string[] = 'CapachicaTours'.split('');

  constructor(
    private slidersService: SlidersService,
    private servicioService: ServiciosService,
    private paqueteTuristicoService: PaqueteTuristicoService,
    private resenaService: ResenaService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarSliders();
    this.obtenerServiciosConReseñas();
    this.obtenerServiciosPorTipoExperiencia();
    this.obtenerPaquetesTuristicos();
  }

  ngAfterViewInit(): void {
    const tl = gsap.timeline({
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#logo-mask',
        start: 'top top',
        end: '+=200%',
        scrub: true,
        pin: true
      }
    });

    tl
      .to('#hero-key', { duration: 1, scale: 1 })
      .to('.logo-title-container, #hero-footer, #hero-play-button', {
        opacity: 0,
        y: -30,
        duration: 0.5
      }, '<')
      .to('#text-mask', {
        opacity: 1,
        duration: 0.5
      }, '>')
      .to('#text-mask', {
        maskSize: 'clamp(35vh,40%,45vh)',
        WebkitMaskSize: 'clamp(35vh,40%,45vh)',
        duration: 3
      }, '>')
      .to('.main-content', {
        opacity: 1,
        duration: 1.5
      }, '-=2')
      .to('#hero-key, #text-mask', {
        opacity: 0,
        duration: 0.5
      }, '>')
      .add(() => {
        document.querySelector('.main-content')?.classList.add('visible');
        initFlowbite();
      });

    gsap.set('#text-mask', {
      opacity: 0
    });

    gsap.from('.logo-title-container', {
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power2.out'
    });
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

 

  startCarousel() {
    this.carouselInterval = setInterval(() => {
      const items = document.querySelectorAll('.carousel-item');
      items[this.currentCarouselIndex].classList.remove('active');
      this.currentCarouselIndex = (this.currentCarouselIndex + 1) % items.length;
      items[this.currentCarouselIndex].classList.add('active');
    }, 3000);
  }

  cargarSliders(): void {
    this.slidersService.listarSliders().subscribe({
      next: (res) => {
        this.sliders = res.data ?? res;
        setTimeout(() => initFlowbite(), 0);
      },
      error: (err) => {
        console.error('Error al cargar sliders:', err);
      }
    });
  }

  obtenerServiciosConReseñas(): void {
    this.tipoServicioId = '3';
    this.isLoading = true;
    this.servicioService.listarServiciosPorTipo(this.tipoServicioId).subscribe((res: any) => {
      this.serviciosAlojamiento = res;

      this.serviciosAlojamiento.forEach(servicio => {
        this.resenaService.obtenerPromedioDeCalificacion(servicio.id).subscribe((promedio: any) => {
          servicio.promedioCalificacion = promedio.promedioCalificacion;
          servicio.totalResenas = promedio.totalResenas;
        });

        this.resenaService.obtenerReseñas().subscribe((reseñas: any) => {
          servicio.reseñas = reseñas.filter((resena: any) => resena.servicioId === servicio.id);
        });
      });

      this.isLoading = false;
    });
  }

  obtenerServiciosPorTipoExperiencia(): void {
    this.tipoServicioId = '8';
    this.servicioService.listarServiciosPorTipo(this.tipoServicioId).subscribe(
      (res: any) => {
        if (res) {
          this.serviciosExperiencia = res;
        } else {
          console.error('Error al obtener los servicios de Experiencia', res);
        }
      },
      error => {
        console.error('Error en la solicitud de servicios por tipo Experiencia', error);
      }
    );
  }

 // 3. Método simplificado para obtener paquetes (SIN procesar array de imágenes)
obtenerPaquetesTuristicos(): void {
  this.isLoading = true;
  this.paqueteTuristicoService.listarPaquetesTuristicos().subscribe(
    (res: any) => {
      // Manejar diferentes estructuras de respuesta
      this.paquetesTuristicos = res.data || res;
      
      console.log('=== DEBUG PAQUETES TURÍSTICOS ===');
      console.log('Total paquetes:', this.paquetesTuristicos.length);
      
      if (this.paquetesTuristicos.length > 0) {
        const primerPaquete = this.paquetesTuristicos[0];
        console.log('Primer paquete ID:', primerPaquete.id);
        console.log('Primer paquete nombre:', primerPaquete.nombre);
        console.log('URL de imagen que se generará:', this.obtenerImagenPaquete(primerPaquete));
      }
      console.log('=== FIN DEBUG ===');
    },
    (error) => {
      console.error('Error al obtener paquetes turísticos:', error);
      this.paquetesTuristicos = [];
    },
    () => {
      this.isLoading = false;
    }
  );
}

// 4. OPCIONAL: Método para verificar múltiples extensiones
obtenerImagenPaqueteConFallbacks(paquete: any): string {
  const imagenFallback = 'img/fam1.png';
  const supabaseStorageUrl = 'https://twsevdzjdnwjhdysvecm.supabase.co/storage/v1/object/public/paquetes-turisticos/';
  
  if (!paquete || !paquete.id) {
    return imagenFallback;
  }
  
  // Si sabes que tienes diferentes extensiones, puedes usar este enfoque
  const extensiones = ['jpg', 'jpeg', 'png', 'webp'];
  
  // Por ahora, usa jpg como predeterminado
  // En el futuro puedes implementar lógica para probar diferentes extensiones
  return `${supabaseStorageUrl}paquete-${paquete.id}.jpg`;
}


// 1. Método principal para obtener imagen (USAR ESTE EN EL HTML)
obtenerImagenPaquete(paquete: any): string {
  const imagenFallback = 'img/fam1.png';
  const supabaseStorageUrl = 'https://twsevdzjdnwjhdysvecm.supabase.co/storage/v1/object/public/paquetes-turisticos/';
  
  // Verificar que el paquete tenga un ID válido
  if (!paquete || !paquete.id) {
    console.warn('Paquete sin ID:', paquete);
    return imagenFallback;
  }
  
  // Construir URL basada en ID del paquete
  // Formato: paquete-{id}.jpg (puedes cambiar la extensión según tus archivos)
  const urlImagen = `${supabaseStorageUrl}paquete-${paquete.id}.jpg`;
  
  console.log(`Intentando cargar imagen para paquete ${paquete.id}:`, urlImagen);
  return urlImagen;
}

// 2. Método mejorado de manejo de errores
onImageError(event: any, paquete?: any): void {
  console.warn('Error cargando imagen:', event.target.src);
  
  if (paquete) {
    console.warn(`No se pudo cargar imagen para paquete ${paquete.id}: ${paquete.nombre}`);
  }
  
  // Cambiar a imagen fallback
  event.target.src = 'img/fam1.png';
}


// TrackBy function para mejor rendimiento en *ngFor
trackByPaqueteId(index: number, paquete: any): any {
  return paquete.id || index;
}

// Método para precargar imágenes (opcional)
precargarImagenes(): void {
  this.paquetesTuristicos.forEach(paquete => {
    if (paquete.imagenes && paquete.imagenes.length > 0) {
      const img = new Image();
      img.src = this.obtenerImagenPaquete(paquete);
    }
  });
}


  verDetallesPaquete(id: number): void {
    this.router.navigate([`/paquetesdetalle/${id}`]);
  }

  verDetallesServicios(id: number): void {
    this.router.navigate([`/serviciosdetalle/${id}`]);
  }
}