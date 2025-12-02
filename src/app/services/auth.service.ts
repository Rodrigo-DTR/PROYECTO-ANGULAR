import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getUser() {
    try { const raw = localStorage.getItem('usuario'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  }

  isAuthenticated() { return !!this.getUser(); }
  isAdmin() { const u = this.getUser(); return u && u.rol === 'admin'; }
}
