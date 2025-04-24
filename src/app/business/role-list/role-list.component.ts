import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../sidebar/navbar/navbar.component';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule,SidebarComponent,NavbarComponent],
  templateUrl: './role-list.component.html',
})
export class RoleListComponent {
  http = inject(HttpClient);
  platformId = inject(PLATFORM_ID);

  roles: any[] = []; // Esta variable contendrá los roles
  errorMessage: string = ''; // Variable para mostrar errores, si los hay
  loading: boolean = true; // Indicador de carga

  ngOnInit() {
    // Verifica si estamos en el navegador antes de usar localStorage
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken'); // Asegúrate de que el token esté en localStorage

      if (!token) {
        this.errorMessage = 'No se encontró el token. Asegúrate de estar logueado.';
        this.loading = false; // Termina la carga si no hay token
        return; // Si no hay token, no intentamos hacer la solicitud
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      // Realizamos la petición HTTP para obtener los roles
      this.http.get<any[]>('https://capachica-tours-backend.vercel.app/api/rbac/roles', { headers })
        .subscribe({
          next: (data) => {
            console.log('Roles obtenidos:', data); // Verifica en consola que los datos están llegando
            this.roles = data; // Asignamos los roles a la variable
            this.loading = false; // Termina la carga al recibir los datos
          },
          error: (err) => {
            this.errorMessage = 'Hubo un error al obtener los roles. Inténtalo nuevamente.';
            this.loading = false; // Termina la carga en caso de error
            console.error('Error al obtener roles:', err);
          }
        });
    } else {
      this.errorMessage = 'Este componente solo se puede ejecutar en el navegador.';
      this.loading = false;
    }
  }
}
