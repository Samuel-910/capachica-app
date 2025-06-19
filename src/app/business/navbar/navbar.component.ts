import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

import { EmprendimientoService } from '../../core/services/emprendimiento.service';
import { PaqueteTuristicoService } from '../../core/services/paquetes-turisticos.service';
import { LugaresService } from '../../core/services/lugar.service';
import { TiposServicioService } from '../../core/services/tipos-servicios.service';
import Swal from 'sweetalert2';
import { ChatbotService } from '../../core/services/chatbot.service';
interface Message {
  from: 'user' | 'bot';
  text: string;
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //chatbot
  messages: Message[] = [];
  inputMessage = '';
  loading = false;
  showChat = false;
  //catbot
  // Datos
  tiposServicio: any[] = [];
  emprendimientoNombres: string[] = [];
  paqueteNombres: string[] = [];
  tiposServicios: string[] = [];
  lugarOpciones: string[] = [];
  resultados: any[] = [];
  cartItems: any[] = [];
  public ocultarNav = false;
  private lastScrollPosition = 0;
  public hideNavOnScroll = false;

  // Estado de búsqueda
  isLoading: boolean = false;
  searchError: string | null = null;
  lastSearchParams: any = null;

  // Filtros de búsqueda
  tipoBusqueda: string = 'emprendimientos';
  searchSelection: string = '';
  searchSelectionLugar: string = '';
  fechaInferior: string = '';

  // Emisor de resultados
  @Output() resultadosBusqueda = new EventEmitter<any[]>();

  // Subject para debounce de búsqueda
  private searchSubject = new Subject<void>();

  constructor(
    private emprendimientoService: EmprendimientoService,
    private paqueteService: PaqueteTuristicoService,
    private lugarService: LugaresService,
    private tiposServicioService: TiposServicioService,
    public router: Router,
    private readonly chatbot: ChatbotService
  ) {
    // Configurar debounce para la búsqueda
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.ejecutarBusqueda();
    });
  }

  ngOnInit() {
    const storedCart = localStorage.getItem('cart');
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];
    this.cargarDatos();
    initFlowbite();
  }

    //chatbot
  toggleChat(): void {
    this.showChat = !this.showChat;
    if (this.showChat && this.messages.length === 0) {
      this.loadHistory();
    }
  }

  private loadHistory(): void {
    this.chatbot.getHistory().subscribe(history => {
      this.messages = history.map(h => ({ from: 'user', text: h.message }));
    });
  }

send(): void {
  if (!this.inputMessage.trim()) return;
  this.messages.push({ from: 'user', text: this.inputMessage });
  this.loading = true;

  this.chatbot.sendMessage(this.inputMessage).subscribe(
    res => {
      const reply = res.response ?? res.reply ?? res.message ?? 'Sin respuesta';
      // Convertir los **texto** en negrita a <b>texto</b> y añadir saltos de línea
      const formattedReply = this.convertMarkdownToHtml(reply);
      this.messages.push({ from: 'bot', text: formattedReply });
      this.loading = false;
    },
    () => {
      this.messages.push({ from: 'bot', text: 'Error al enviar mensaje.' });
      this.loading = false;
    }
  );

  this.inputMessage = '';
}

// Función para convertir markdown **texto** a <b>texto</b> y agregar saltos de página
convertMarkdownToHtml(text: string): string {
  // Reemplazar **texto** por <b>texto</b>
  let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');  
  // Insertar un salto de línea (<br>) después de cada punto
  formattedText = formattedText.replace(/(\.)(?=\s)/g, '$1<br>'); // Salto de línea después de cada punto
  return formattedText;
}



//aqui
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const currentScroll = window.scrollY;

    // Si estamos al inicio de la página, siempre mostrar la barra
    if (currentScroll < 50) {
      this.hideNavOnScroll = false;
      this.lastScrollPosition = currentScroll;
      return;
    }

    // Ocultar al hacer scroll hacia abajo, mostrar al hacer scroll hacia arriba
    this.hideNavOnScroll = currentScroll > this.lastScrollPosition;
    this.lastScrollPosition = currentScroll;
  }

  // Carga inicial de datos
  private async cargarDatos() {
    try {
      await Promise.all([
        this.loadEmprendimientoNombres(),
        this.loadPaqueteNombres(),
        this.loadTiposServicios(),
        this.loadLugaresTuristicos(),
        this.cargarTiposServicio()
      ]);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      this.mostrarError('Error al cargar los datos iniciales');
    }
  }

  cargarTiposServicio(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tiposServicioService.listarTiposServicio().subscribe({
        next: (data) => {
          this.tiposServicio = data;
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar tipos de servicio:', err);
          reject(err);
        }
      });
    });
  }

  refreshData(tipoId: string): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/prinservicios', tipoId]);
    });
  }

  // Métodos de carga de datos
  private loadEmprendimientoNombres() {
    return new Promise((resolve, reject) => {
      this.emprendimientoService.listarEmprendimientos().subscribe({
        next: (data) => {
          const items = Array.isArray((data as any).emprendimientos) ? (data as any).emprendimientos : data;
          this.emprendimientoNombres = items.map((e: any) => e.nombre).filter((n: string) => !!n);
          resolve(true);
        },
        error: (error) => {
          console.error('Error al cargar emprendimientos:', error);
          reject(error);
        }
      });
    });
  }

  private loadPaqueteNombres() {
    return new Promise((resolve, reject) => {
      this.paqueteService.listarPaquetesTuristicos().subscribe({
        next: (data) => {
          this.paqueteNombres = (data as any[]).map(p => p.nombre).filter(n => !!n);
          resolve(true);
        },
        error: (error) => {
          console.error('Error al cargar paquetes:', error);
          reject(error);
        }
      });
    });
  }

  private loadTiposServicios() {
    return new Promise((resolve, reject) => {
      this.tiposServicioService.listarTiposServicio().subscribe({
        next: (data) => {
          this.tiposServicios = (data as any[]).map(s => s.nombre).filter(n => !!n);
          resolve(true);
        },
        error: (error) => {
          console.error('Error al cargar tipos de servicios:', error);
          reject(error);
        }
      });
    });
  }

  private loadLugaresTuristicos() {
    return new Promise((resolve, reject) => {
      this.lugarService.listarLugares().subscribe({
        next: (data) => {
          this.lugarOpciones = (data as any[]).map(l => l.nombre).filter(n => !!n);
          resolve(true);
        },
        error: (error) => {
          console.error('Error al cargar lugares:', error);
          reject(error);
        }
      });
    });
  }

  // Métodos de búsqueda
  buscar(): void {
    this.searchError = null;
    this.searchSubject.next();
  }

  private async ejecutarBusqueda() {
    if (this.isLoading) return;

    const filtros = this.prepararFiltros();
    if (!this.validarFiltros(filtros)) return;

    this.isLoading = true;
    this.lastSearchParams = { ...filtros };

    try {
      switch (this.tipoBusqueda) {
        case 'emprendimientos':
          await this.buscarEmprendimientos(filtros);
          break;
        case 'paquetes':
          await this.buscarPaquetes(filtros);
          break;
        case 'servicios':
          await this.buscarServicios(filtros);
          break;
        default:
          this.resultados = [];
      }
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      this.mostrarError('Error al realizar la búsqueda');
    } finally {
      this.isLoading = false;
    }
  }

  private prepararFiltros(): any {
    const filtros: any = {};
    if (this.searchSelection) filtros.nombre = this.searchSelection;
    if (this.searchSelectionLugar) filtros.lugar = this.searchSelectionLugar;
    if (this.fechaInferior) filtros.fecha = this.fechaInferior;
    return filtros;
  }

  private validarFiltros(filtros: any): boolean {
    if (Object.keys(filtros).length === 0) {
      this.mostrarError('Por favor, selecciona al menos un criterio de búsqueda');
      return false;
    }
    return true;
  }

  private buscarEmprendimientos(filtros: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.emprendimientoService.buscarConFiltros(filtros).subscribe({
        next: (res) => {
          this.procesarResultados(res);
          resolve();
        },
        error: (error) => reject(error)
      });
    });
  }

  private buscarPaquetes(filtros: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.paqueteService.buscarConFiltros(filtros).subscribe({
        next: (res) => {
          this.procesarResultados(res);
          resolve();
        },
        error: (error) => reject(error)
      });
    });
  }

  private buscarServicios(filtros: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.tiposServicioService.buscarConFiltros(filtros).subscribe({
        next: (res) => {
          this.procesarResultados(res);
          resolve();
        },
        error: (error) => reject(error)
      });
    });
  }

  private procesarResultados(res: any) {
    let items: any[] = [];

    if (res.emprendimientos) {
      items = res.emprendimientos;
    } else if (res.paquetes) {
      items = res.paquetes;
    } else if (res.servicios) {
      items = res.servicios;
    } else if (Array.isArray(res)) {
      items = res;
    }

    // Procesar y enriquecer los resultados
    this.resultados = items.map(item => ({
      ...item,
      numResenas: item.numResenas || 0,
      rating: item.rating || 0,
      imagenUrl: item.imagenUrl || null
    }));

    this.resultadosBusqueda.emit(this.resultados);
  }

  // Utilidades
  private mostrarError(mensaje: string) {
    this.searchError = mensaje;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      timer: 3000,
      showConfirmButton: false
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Limpiar búsqueda
  limpiarBusqueda() {
    this.searchSelection = '';
    this.searchSelectionLugar = '';
    this.fechaInferior = '';
    this.resultados = [];
    this.searchError = null;
    this.lastSearchParams = null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión correctamente.',
      confirmButtonText: 'Aceptar'
    });
    this.router.navigate(['/login']);
  }
  // Agregar esta función en tu componente TypeScript
  getServiceIcon(serviceName: string): string {
    const name = serviceName.toLowerCase();

    // Hoteles y Alojamiento
    if (name.includes('hotel') || name.includes('alojamiento') || name.includes('hospedaje')) {
      return 'fas fa-bed';
    }

    // Restaurantes y Comida
    if (name.includes('restaurante') || name.includes('comida') || name.includes('gastronomia')) {
      return 'fas fa-utensils';
    }

    // Transporte
    if (name.includes('transporte') || name.includes('taxi') || name.includes('bus')) {
      return 'fas fa-car';
    }

    // Tours y Guías
    if (name.includes('tour') || name.includes('guia') || name.includes('excursion')) {
      return 'fas fa-route';
    }

    // Aventura y Deportes
    if (name.includes('aventura') || name.includes('deporte') || name.includes('kayak') || name.includes('trekking')) {
      return 'fas fa-hiking';
    }

    // Artesanías
    if (name.includes('artesania') || name.includes('souvenir') || name.includes('tienda')) {
      return 'fas fa-gift';
    }

    // Spa y Relajación
    if (name.includes('spa') || name.includes('masaje') || name.includes('relajacion')) {
      return 'fas fa-spa';
    }

    // Eventos
    if (name.includes('evento') || name.includes('fiesta') || name.includes('celebracion')) {
      return 'fas fa-calendar-alt';
    }

    // Entretenimiento
    if (name.includes('entretenimiento') || name.includes('show') || name.includes('musica')) {
      return 'fas fa-music';
    }

    // Información Turística
    if (name.includes('informacion') || name.includes('centro de informacion')) {
      return 'fas fa-info-circle';
    }

    // Por defecto
    return 'fas fa-star';
  }
}