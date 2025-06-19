
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly baseUrl = 'https://capachica-app-back-production.up.railway.app/chatbot';

  constructor(private readonly http: HttpClient) { }


  sendMessage(content: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/send`, { message: content });
  }

  getHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history`);
  }

  deleteHistory(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/history`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`);
  }

  getHelp(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/help`);
  }
}
