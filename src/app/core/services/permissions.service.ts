import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly API = 'https://capachica-app-back-production.up.railway.app/permissions';

  constructor(private http: HttpClient) { }

  // Crear un nuevo permiso (POST /permissions)
  crearPermiso(data: any): Observable<any> {
    return this.http.post(this.API, data, this.getAuthHeaders());
  }

  // Obtener todos los permisos (GET /permissions)
  listarPermisos(): Observable<any> {
    return this.http.get(this.API, this.getAuthHeaders());
  }

  // Obtener un permiso por ID (GET /permissions/{id})
  obtenerPermiso(id: number | string): Observable<any> {
    return this.http.get(`${this.API}/${id}`, this.getAuthHeaders());
  }

  // Actualizar un permiso (PATCH /permissions/{id})
  actualizarPermiso(id: number | string, data: any): Observable<any> {
    return this.http.patch(`${this.API}/${id}`, data, this.getAuthHeaders());
  }

  // Eliminar un permiso (DELETE /permissions/{id})
  eliminarPermiso(id: number | string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`, this.getAuthHeaders());
  }

  // Utilidad: obtener headers con token
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
}
