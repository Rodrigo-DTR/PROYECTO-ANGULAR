import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NotificationItem { id: string; titulo: string; mensaje: string; categoria: string; ts: number; }

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _items$ = new BehaviorSubject<NotificationItem[]>([]);
  readonly items$ = this._items$.asObservable();

  constructor(private http: HttpClient) {
    this.fetch();
    interval(30000).pipe(switchMap(() => this.http.get<NotificationItem[]>(`${environment.apiBase}/notifications?limit=10`)))
      .subscribe(items => this._items$.next(items));
  }

  fetch() {
    this.http.get<NotificationItem[]>(`${environment.apiBase}/notifications?limit=10`).subscribe(items => this._items$.next(items));
  }

  backfill(limit = 2) {
    const rol = localStorage.getItem('rol') || '';
    return this.http.post<{ created: number; scanned: number }>(`${environment.apiBase}/notifications/backfill?limit=${limit}`, {}, { headers: { 'x-role': rol } });
  }
}
