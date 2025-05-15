import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-misreservas',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './misreservas.component.html',
  styleUrl: './misreservas.component.css'
})
export class MisreservasComponent implements OnInit{
ngOnInit(): void {
    initFlowbite();
}
}
