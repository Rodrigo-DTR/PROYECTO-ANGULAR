import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  private _usuario = signal<any | null>(null);
  nombre = '';
  email = '';
  password = '';
  private _guardando = signal(false);

  constructor(private http: HttpClient, public router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem('usuario');
      if (raw) {
        const parsed = JSON.parse(raw);
        this._usuario.set(parsed);
        this.nombre = parsed.nombre;
        this.email = parsed.email;
      }
    } catch {
      this._usuario.set(null);
    }
  }

  async guardar() {
    if (!this._usuario()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.nombre || this.nombre.trim() === '') {
      this.toastr.error('✗ El nombre no puede estar vacío', 'Error', { positionClass: 'toast-top-right', timeOut: 3000 });
      return;
    }

    this._guardando.set(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res: any = await firstValueFrom(
        this.http.put(`${environment.apiBase}/auth/profile/${this._usuario().id}`,
          { nombre: this.nombre, password: this.password || undefined },
          { headers: headers as any }
        )
      );

      const localUser = { ...this._usuario(), nombre: this.nombre };
      localStorage.setItem('usuario', JSON.stringify(localUser));
      this._usuario.set(localUser);

      this.toastr.success('✓ Perfil actualizado correctamente', 'Éxito', { positionClass: 'toast-top-right', timeOut: 3000 });
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.error?.error || err?.error?.message || 'Error al actualizar perfil';
      this.toastr.error('✗ ' + errMsg, 'Error', { positionClass: 'toast-top-right', timeOut: 3000 });

      const localUser = { ...this._usuario(), nombre: this.nombre };
      localStorage.setItem('usuario', JSON.stringify(localUser));
      this._usuario.set(localUser);
    } finally {
      this._guardando.set(false);
    }
  }
  get usuario() { return this._usuario(); }
  get guardando() { return this._guardando(); }
}

