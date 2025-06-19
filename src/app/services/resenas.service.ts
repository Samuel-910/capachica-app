import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
}

export interface Resena {
  id: number;
  servicioId: number;
  calificacion: number;
  comentario: string;
  estado?: string;
  createdAt?: string;
  updatedAt?: string;
  usuario?: Usuario;
}

export interface NuevaResena {
  servicioId: number;
  calificacion: number;
  comentario: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResenasService {
  private apiUrl = 'https://capachica-app-back-production.up.railway.app';

  constructor(private http: HttpClient) { }

  getAllResenas(): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/resenas`, this.getAuthHeaders()).pipe(
      map(resenas => {
        return resenas.map(resena => ({
          ...resena,
          usuario: resena.usuario || this.getUsuarioMock(resena.id)
        }));
      })
    );
  }

  crearResena(nuevaResena: NuevaResena): Observable<Resena> {
    return this.http.post<Resena>(`${this.apiUrl}/resenas`, nuevaResena, this.getAuthHeaders());
  }

  private getUsuarioMock(id: number): Usuario {
    return {
      id: id,
      nombre: `Usuario ${id}`,
      apellidos: 'Apellido',
      email: `usuario${id}@example.com`
    };
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }
} 