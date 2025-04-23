import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { NavbarComponent } from '../navbar/navbar.component';

// register Swiper custom elements
register();
@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.css'
})
export class PrincipalComponent {

}
