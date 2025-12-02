import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  async handleRegister() {
    if (!this.nombre || !this.email || !this.password) {
      this.toastr.error('Por favor completa todos los campos');
      return;
    }
    try {
      const res: any = await firstValueFrom(
        this.http.post(`${environment.apiBase}/auth/register`, { nombre: this.nombre, email: this.email, password: this.password, rol: 'usuario' })
      );
      this.toastr.success('Registro exitoso. Por favor inicia sesión.');
      this.router.navigate(['/login']);
    } catch (err: any) {
      const errMsg = err?.error?.error || err?.error?.message || 'Error al registrarse';
      this.toastr.error(errMsg);
      console.error('Register error:', err);
    }
  }
}
