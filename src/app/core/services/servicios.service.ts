import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  public apiUrl = 'https://capachica-app-back-production.up.railway.app/servicios'; // ajusta tu URL base

  constructor(private http: HttpClient) {}

  // POST /servicios/emprendimiento/{emprendimientoId}
  crearServicio(emprendimientoId: number, servicio: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/emprendimiento/${emprendimientoId}`, servicio);
  }


  // GET /servicios/emprendimiento/{emprendimientoId}
  getServiciosByEmprendimiento(emprendimientoId: number, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/emprendimiento/${emprendimientoId}`, {
      params: {
        page: page.toString(),
        limit: limit.toString()
      }
    });
  }

  // GET /servicios
  getAllServicios(paginaActual: number, limitePorPagina: number): Observable<any> {
    const params = {
      pagina: paginaActual.toString(),
      limite: limitePorPagina.toString()
    };

    return this.http.get<any>(this.apiUrl, { params });
  }

  // GET /servicios/{id}
  getServicioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // PATCH /servicios/{id}
  actualizarServicio(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

  // DELETE /servicios/{id}
  eliminarServicio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // PATCH /servicios/{id}/estado
  cambiarEstado(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, {});
  }
}
