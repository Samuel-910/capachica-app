import { Component, HostListener, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';

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

  tiposServicio: any[] = [];
  emprendimientoNombres: string[] = [];
  paqueteNombres: string[] = [];
  tiposServicios: string[] = [];

  lugarOpciones: string[] = [];
  resultados: any[] = [];

  // Inferior
  searchSelection: string = '';
  searchSelectionLugar: string = '';
  fechaInferior: string = '';

  // Superior
  tipoBusqueda: string = 'emprendimientos';
  lugarSuperior: string = '';
  fechaSuperior: string = '';
  cartItems: any[] = [];
  public ocultarNav = false;
  @Output() resultadosBusqueda = new EventEmitter<any[]>();

  constructor(
    private readonly emprendimientoService: EmprendimientoService,
    private readonly paqueteService: PaqueteTuristicoService,
    private readonly lugarService: LugaresService,
    private readonly tiposServicioService: TiposServicioService,
    public readonly router: Router,
    private readonly chatbot: ChatbotService
  ) { }

  @HostListener('window:scroll') onScroll() {
    this.ocultarNav = window.scrollY > 100;
  }

  ngOnInit(): void {
    const storedCart = localStorage.getItem('cart');
    this.cartItems = storedCart ? JSON.parse(storedCart) : [];
    initFlowbite();
    this.loadEmprendimientoNombres();
    this.loadPaqueteNombres();
    this.loadTiposServicios();
    this.loadLugaresTuristicos();
    this.cargarTiposServicio();
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
        // Ahora el backend devuelve { response: string }
        const reply = res.response ?? res.reply ?? res.message ?? 'Sin respuesta';
        this.messages.push({ from: 'bot', text: reply });
        this.loading = false;
      },
      () => {
        this.messages.push({ from: 'bot', text: 'Error al enviar mensaje.' });
        this.loading = false;
      }
    );

    this.inputMessage = '';
  }
//aqui
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

  refreshData(tipoId: string): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/prinservicios`, tipoId]);
    });
  }

  private loadEmprendimientoNombres() {
    this.emprendimientoService.listarEmprendimientos()
      .subscribe(data => {
        const items = Array.isArray((data as any).emprendimientos) ? (data as any).emprendimientos : data;
        this.emprendimientoNombres = items.map((e: any) => e.nombre).filter((n: string) => !!n);
      });
  }

  private loadPaqueteNombres() {
    this.paqueteService.listarPaquetesTuristicos()
      .subscribe(data => {
        this.paqueteNombres = (data as any[]).map(p => p.nombre).filter(n => !!n);
      });
  }

  private loadTiposServicios() {
    this.tiposServicioService.listarTiposServicio()
      .subscribe(data => {
        this.tiposServicios = (data as any[]).map(s => s.nombre).filter(n => !!n);
      });
  }

  private loadLugaresTuristicos() {
    this.lugarService.listarLugares()
      .subscribe(data => {
        this.lugarOpciones = (data as any[]).map(l => l.nombre).filter(n => !!n);
      });
  }

  buscar(): void {
    console.log('▶️ filtros en buscar():', {
      tipo: this.tipoBusqueda,
      nombre: this.searchSelection,
      lugar: this.searchSelectionLugar || this.lugarSuperior,
      fecha: this.fechaSuperior || this.fechaInferior
    });

    const filtros: any = {};
    if (this.searchSelection) filtros.nombre = this.searchSelection;
    const lugar = this.searchSelectionLugar || this.lugarSuperior;
    if (lugar) filtros.lugar = lugar;
    const fecha = this.fechaSuperior || this.fechaInferior;
    if (fecha) filtros.fecha = fecha;

    switch (this.tipoBusqueda) {
      case 'emprendimientos':
        this.emprendimientoService.buscarConFiltros(filtros)
          .subscribe(res => this.onResultados(res));
        break;
      case 'paquetes':
        this.paqueteService.buscarConFiltros(filtros)
          .subscribe(res => this.onResultados(res));
        break;
      case 'servicios':
        this.tiposServicioService.buscarConFiltros(filtros)
          .subscribe(res => this.onResultados(res));
        break;
      default:
        this.resultados = [];
    }
  }

  private onResultados(res: any) {
    // Desempaquetar posibles metadatos
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

    console.log('🔍 ítems para renderizar:', items);
    this.resultados = items;
    this.resultadosBusqueda.emit(items);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Devuelve true si hay un token
  }

  // Cierra la sesión
  logout(): void {
    localStorage.removeItem('token');  // Elimina el token del localStorage
    localStorage.removeItem('usuario'); // Elimina el usuario del localStorage
    Swal.fire({
      icon: 'success',
      title: 'Sesión cerrada',
      text: 'Has cerrado sesión correctamente.',
      confirmButtonText: 'Aceptar'
    });
    // Redirigir al login o home
    this.router.navigate(['/login']);
  }
}