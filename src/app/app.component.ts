import { Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NavbarComponent } from "./navbar/navbar.component";
import { CommonModule } from '@angular/common';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'capachica-app';

}
