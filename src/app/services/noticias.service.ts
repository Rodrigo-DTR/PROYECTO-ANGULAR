import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  apiBase = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  list() {
    return firstValueFrom(this.http.get<any[]>(`${this.apiBase}/noticias`));
  }

  create(fd: FormData) {
    return firstValueFrom(this.http.post(`${this.apiBase}/noticias`, fd));
  }

  update(id: any, fd: FormData) {
    return firstValueFrom(this.http.put(`${this.apiBase}/noticias/${id}`, fd));
  }

  delete(id: any, body?: any) {
    return firstValueFrom(this.http.request('delete', `${this.apiBase}/noticias/${id}`, { body }));
  }
}
