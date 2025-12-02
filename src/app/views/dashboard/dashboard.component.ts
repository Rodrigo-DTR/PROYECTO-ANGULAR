import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private _usuario = signal<any | null>(null);
  private _noticias = signal<any[]>([]);
  private _cargando = signal(true);
  environment = environment;
  constructor(private http: HttpClient, private toastr: ToastrService) {}
  ngOnInit(): void {
    this.cargarDatos();
  }
  cargarDatos() {
    try {
      const rawUser = localStorage.getItem('usuario');
      if (rawUser) {
        this._usuario.set(JSON.parse(rawUser));
      }
    } catch (e) {
      this._usuario.set(null);
    }
    // carga noticias desde API
    this._cargando.set(true);
    try {
      this.http.get(`${environment.apiBase}/noticias`).subscribe({
        next: (res: any) => {
          this._noticias.set(Array.isArray(res) ? res : []);
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('✗ Error al cargar noticias', 'Error', { positionClass: 'toast-top-right', timeOut: 3000 });
          this._noticias.set([]);
        },
        complete: () => {
          this._cargando.set(false);
        }
      });
    } catch (err) {
      console.error(err);
      this.toastr.error('✗ Error al cargar noticias', 'Error', { positionClass: 'toast-top-right', timeOut: 3000 });
      this._noticias.set([]);
      this._cargando.set(false);
    }
  }

  formatFecha(f: any) {
    try {
      return new Date(f).toLocaleString();
    } catch {
      return f;
    }
  }
  get usuario() { return this._usuario(); }
  get noticias() { return this._noticias(); }
  get cargando() { return this._cargando(); }
}
