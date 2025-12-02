import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NotificationService, NotificationItem } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  usuario: any = null;
  rol: string | null = null;
  showMenu = false;
  showNotifs = false;
  notifs: NotificationItem[] = [];
  @ViewChild('notifMenu') notifMenuRef?: ElementRef;
  @ViewChild('bellBtn') bellBtnRef?: ElementRef;

  constructor(private router: Router, private notifSvc: NotificationService) {
    this.loadUser();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadUser();
      }
    });
    this.notifSvc.items$.subscribe(items => this.notifs = items);
  }

  loadUser() {
    try {
      const raw = localStorage.getItem('usuario');
      this.usuario = raw ? JSON.parse(raw) : null;
    } catch (e) {
      this.usuario = null;
    }
    this.rol = localStorage.getItem('rol');
  }

  toggleMenu() { this.showMenu = !this.showMenu; }
  toggleNotifs() { this.showNotifs = !this.showNotifs; }
  crearNotifsDesdeNoticias() {
    this.notifSvc.backfill(2).subscribe({
      next: (res) => {
        this.notifSvc.fetch();
        this.showNotifs = true;
      },
      error: () => {
        console.error('No se pudo crear notificaciones');
      }
    });
  }
  irPerfil() { this.showMenu = false; this.router.navigate(['/perfil']); }
  logout() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    localStorage.removeItem('token');
    this.usuario = null;
    this.rol = null;
    this.showMenu = false;
    this.router.navigate(['/login']);
  }

  @HostListener('document:keydown.escape')
  onEscKey() {
    this.showNotifs = false;
    this.showMenu = false;
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    const target = ev.target as HTMLElement;
    const notifMenuEl = this.notifMenuRef?.nativeElement as HTMLElement | undefined;
    const bellBtnEl = this.bellBtnRef?.nativeElement as HTMLElement | undefined;
    if (this.showNotifs) {
      const insideMenu = notifMenuEl && notifMenuEl.contains(target);
      const onBell = bellBtnEl && bellBtnEl.contains(target);
      if (!insideMenu && !onBell) this.showNotifs = false;
    }
    if (this.showMenu) {
      const menuOpen = false; 
      if (!menuOpen && !target.closest('.btn-user') && !target.closest('.dropdown-menu')) {
        this.showMenu = false;
      }
    }
  }
}
