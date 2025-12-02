import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface CommentItem {
  id: string;
  noticiaId: string;
  texto: string;
  usuario: { id: string | null; nombre: string };
  creadoEn: string;
}

@Injectable({ providedIn: 'root' })
export class CommentsService {
  constructor(private http: HttpClient) {}

  list(noticiaId: string): Observable<CommentItem[]> {
    return this.http.get<CommentItem[]>(`${environment.apiBase}/comments/${noticiaId}`);
  }

  create(noticiaId: string, texto: string): Observable<CommentItem> {
    const usuarioRaw = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol') || '';
    const headers = new HttpHeaders({ 'x-user': usuarioRaw || '', 'x-role': rol });
    return this.http.post<CommentItem>(`${environment.apiBase}/comments/${noticiaId}`, { texto }, { headers });
  }

  delete(id: string): Observable<CommentItem> {
    const rol = localStorage.getItem('rol') || '';
    const headers = new HttpHeaders({ 'x-role': rol });
    return this.http.delete<CommentItem>(`${environment.apiBase}/comments/${id}`, { headers });
  }
}
