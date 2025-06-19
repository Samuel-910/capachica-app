import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NavbarComponent } from '../sidebar/navbar/navbar.component';


@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {

}
