import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmprendimientoService {
  private readonly API_EMPRENDIMIENTOS = 'https://capachica-tours-backend.vercel.app/api/emprendimientos';

  private readonly LIST_URL            = `${this.API_EMPRENDIMIENTOS}`;
  private readonly DETAIL_URL          = (id: number | string) => `${this.API_EMPRENDIMIENTOS}/${id}`;
  private readonly CREATE_URL          = `${this.API_EMPRENDIMIENTOS}`;
  private readonly MY_LIST_URL         = `${this.API_EMPRENDIMIENTOS}/my/list`;
  private readonly UPDATE_URL          = (id: number | string) => `${this.API_EMPRENDIMIENTOS}/${id}`;
  private readonly DELETE_URL          = (id: number | string) => `${this.API_EMPRENDIMIENTOS}/${id}`;
  private readonly CHANGE_STATUS_URL   = (id: number | string) => `${this.API_EMPRENDIMIENTOS}/${id}/status`;
  private readonly PENDING_LIST_URL    = `${this.API_EMPRENDIMIENTOS}/admin/pending`;


  constructor(private http: HttpClient) {}

  listarEmprendimientos(params?: any): Observable<any> {
    return this.http.get<any>(this.LIST_URL, { params });
  }

  verEmprendimiento(id: number | string): Observable<any> {
    return this.http.get<any>(this.DETAIL_URL(id));
  }

  crearEmprendimiento(data: any): Observable<any> {
    return this.http.post<any>(this.CREATE_URL, data, { withCredentials: true });
  }

  misEmprendimientos(): Observable<any> {
    return this.http.get<any>(this.MY_LIST_URL, { withCredentials: true });
  }

  actualizarEmprendimiento(id: number | string, data: any): Observable<any> {
    return this.http.put<any>(this.UPDATE_URL(id), data, { withCredentials: true });
  }

  eliminarEmprendimiento(id: number | string): Observable<any> {
    return this.http.delete<any>(this.DELETE_URL(id), { withCredentials: true });
  }

  cambiarEstadoEmprendimiento(id: number | string, estado: string): Observable<any> {
    return this.http.patch<any>(this.CHANGE_STATUS_URL(id), { estado }, { withCredentials: true });
  }

  verPendientes(): Observable<any> {
    return this.http.get<any>(this.PENDING_LIST_URL, { withCredentials: true });
  }

}
