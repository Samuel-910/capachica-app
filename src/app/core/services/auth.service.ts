import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_BASE_login = 'https://capachica-app-back-production.up.railway.app/auth';
  private readonly API_BASE_usuario = 'https://capachica-app-back-production.up.railway.app/users';
  private readonly LOGIN_URL = `${this.API_BASE_login}/login`;
  private readonly REGISTER_URL = `${this.API_BASE_usuario}/register`;
  private readonly REQUEST_PASSWORD_URL = `${this.API_BASE_usuario}/request-password-reset`;
  private readonly RESET_PASSWORD_URL = `${this.API_BASE_usuario}/reset-password`;

  private readonly tokenKey = 'authToken';
  private readonly refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(this.LOGIN_URL, { email, password }, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.access_token) {
            this.setToken(response.access_token);
            this.router.navigate(['/dashboard']);
          }
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  register(userData: {
    nombre: string;
    apellidos: string;
    telefono: string;
    direccion: string;
    fotoPerfilUrl: string;
    fechaNacimiento: string;
    subdivisionId: number;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(this.REGISTER_URL, userData, { withCredentials: true })
      .pipe(tap(() => this.router.navigate(['/login'])));
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http
      .post<any>(this.REQUEST_PASSWORD_URL, { email }, { withCredentials: true })
      .pipe(tap(() => console.log('Se ha solicitado el reseteo de la contraseña')));
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http
      .post<any>(this.RESET_PASSWORD_URL, { token, newPassword }, { withCredentials: true })
      .pipe(tap(() => console.log('Contraseña reseteada correctamente')));
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  public getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
