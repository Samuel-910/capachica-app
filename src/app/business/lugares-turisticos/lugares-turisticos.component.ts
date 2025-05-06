import { Component, OnInit } from '@angular/core';
import { LugaresService } from '../../core/services/lugar-service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../sidebar/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lugares-turisticos',
  imports: [SidebarComponent, NavbarComponent, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './lugares-turisticos.component.html',
  styleUrls: ['./lugares-turisticos.component.css']
})
export class LugaresTuristicosComponent implements OnInit {
  lugares: any[] = [];
  isLoading = true;
  errorMessage = '';  

  constructor(private lugaresService: LugaresService) { }

  ngOnInit(): void {
    this.loadLugares();
  }

  loadLugares(): void {
    this.isLoading = true;
    this.lugaresService.getLugares().subscribe({
      next: (data) => {
        this.lugares = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los lugares turísticos';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  deleteLugar(id: string): void {
    if (confirm('¿Estás seguro de eliminar este lugar?')) {
      this.lugaresService.deleteLugar(id).subscribe({
        next: () => {
          this.lugares = this.lugares.filter(l => l.id !== id); // Actualiza la lista
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
        }
      });
    }
  }
  
}