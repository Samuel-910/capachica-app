import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';  // Importación para detectar el navegador

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit {
  isMobileMenuOpen = false;

  dropdownStates = {
    paquetes: false,
    rutas: false,
    familias: false,
    islas: false
  };

  // Propiedades del carrusel
  currentIndex = 2;
  cardWidth = 300;
  gap = 15;
  visibleCards = 3;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(dropdown: 'paquetes' | 'rutas' | 'familias' | 'islas'): void {
    this.dropdownStates[dropdown] = !this.dropdownStates[dropdown];
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  isMobileView(): boolean {
    return window.innerWidth < 768;
  }

  ngAfterViewInit(): void {
    // Solo ejecutamos la lógica si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const cards = document.querySelector('.cards') as HTMLElement;
      const prevBtn = document.getElementById('prev');
      const nextBtn = document.getElementById('next');

      const updateCarousel = () => {
        const card = document.querySelector('.cards li') as HTMLElement;
        if (!card) return;
        const cardWidth = card.offsetWidth + this.gap;  // Ajuste para el espacio entre tarjetas
        cards.style.transform = `translateX(-${this.currentIndex * cardWidth}px)`;
      };

      prevBtn?.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          updateCarousel();
        }
      });

      nextBtn?.addEventListener('click', () => {
        if (this.currentIndex < 5) {  // Limitar la cantidad de tarjetas visibles
          this.currentIndex++;
          updateCarousel();
        }
      });

      updateCarousel();  // Llamamos a la función para inicializar la posición
    }
  }
}
