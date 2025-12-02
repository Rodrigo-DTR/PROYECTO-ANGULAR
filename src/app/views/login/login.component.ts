import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  async handleLogin() {
    if (!this.email || !this.password) {
      this.toastr.error('Por favor completa todos los campos');
      return;
    }
    this.error = null;
    this.loading = true;
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiBase}/auth/login`, { email: this.email, password: this.password })
      );
      if (res.usuario) {
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('token', res.token || '');
        localStorage.setItem('rol', res.usuario.rol || '');
      }
      this.toastr.success('Login exitoso');
      const rol = res.usuario?.rol;
      if (rol === 'admin') this.router.navigate(['/admin']); else this.router.navigate(['/']);
    } catch (err: any) {
      const errMsg = err?.error?.error || err?.error?.message || 'Error al autenticarse';
      this.error = errMsg;
      this.toastr.error(errMsg);
      console.error('Login error:', err);
    } finally { this.loading = false; }
  }
}

