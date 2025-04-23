import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  ngOnInit(): void {
    initFlowbite();
  }
}
