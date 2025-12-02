import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoticiasService } from '../../services/noticias.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  usuario: any = null;
  noticias: any[] = [];
  loading = true;

  // crear
  titulo = '';
  contenido = '';
  imagen: File | null = null;
  archivo: File | null = null;
  creating = false;

  // editar
  editing = false;
  editId: any = null;
  editTitulo = '';
  editContenido = '';
  editImagen: File | null = null;
  editArchivo: File | null = null;

  constructor(
    private noticiasSvc: NoticiasService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.usuario = this.auth.getUser();
    if (!this.usuario || this.usuario.rol !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.loadNoticias();
  }

  async loadNoticias() {
    this.loading = true;
    try {
      this.noticias = await this.noticiasSvc.list();
    } catch (err) {
      console.error('Error cargando noticias', err);
      this.noticias = [];
    } finally {
      this.loading = false;
    }
  }

  onImagenChange(e: any) { this.imagen = e.target.files?.[0] || null; }
  onArchivoChange(e: any) { this.archivo = e.target.files?.[0] || null; }
  onEditImagenChange(e: any) { this.editImagen = e.target.files?.[0] || null; }
  onEditArchivoChange(e: any) { this.editArchivo = e.target.files?.[0] || null; }

  async crearNoticia() {
    if (!this.usuario || this.usuario.rol !== 'admin') return;
    if (!this.titulo || !this.contenido) { this.toastr.error('Título y contenido son obligatorios'); return; }
    if (this.imagen && this.imagen.size > 2 * 1024 * 1024) { this.toastr.error('Imagen demasiado grande (máx 2 MB)'); return; }
    if (this.archivo && this.archivo.size > 5 * 1024 * 1024) { this.toastr.error('Archivo demasiado grande (máx 5 MB)'); return; }
    this.creating = true;
    try {
      const fd = new FormData();
      fd.append('titulo', this.titulo);
      fd.append('contenido', this.contenido);
      fd.append('rol', this.usuario.rol);
      if (this.imagen) fd.append('imagen', this.imagen);
      if (this.archivo) fd.append('archivo', this.archivo);
      const res = await this.noticiasSvc.create(fd);
      this.titulo = '';
      this.contenido = '';
      this.imagen = null;
      this.archivo = null;
      this.toastr.success('✓ Noticia creada correctamente', 'Éxito', { positionClass: 'toast-top-right', timeOut: 3000 });
      await this.loadNoticias();
    } catch (err: any) {
      const errMsg = err?.error?.error || err?.message || 'Error al crear la noticia';
      this.toastr.error('✗ ' + errMsg, 'Error', { positionClass: 'toast-top-right', timeOut: 3000 });
      console.error('Error crear noticia', err);
    } finally { this.creating = false; }
  }

  startEdit(n: any) {
    this.editing = true;
    this.editId = n.id;
    this.editTitulo = n.titulo;
    this.editContenido = n.contenido;
    this.editImagen = null;
    this.editArchivo = null;
  }

  cancelEdit() {
    this.editing = false;
    this.editId = null;
    this.editTitulo = '';
    this.editContenido = '';
  }

  async guardarEdicion() {
    if (!this.usuario || this.usuario.rol !== 'admin') return;
    try {
      const fd = new FormData();
      fd.append('titulo', this.editTitulo);
      fd.append('contenido', this.editContenido);
      fd.append('rol', this.usuario.rol);
      if (this.editImagen) fd.append('imagen', this.editImagen);
      if (this.editArchivo) fd.append('archivo', this.editArchivo);
      const res = await this.noticiasSvc.update(this.editId, fd);
      this.cancelEdit();
      this.toastr.success('✓ Noticia actualizada correctamente', 'Éxito', { positionClass: 'toast-top-right', timeOut: 3000 });
      await this.loadNoticias();
    } catch (err: any) {
      const errMsg = err?.error?.error || err?.message || 'Error al editar la noticia';
      this.toastr.error('✗ ' + errMsg, 'Error', { positionClass: 'toast-top-right', timeOut: 3000 });
      console.error('Error editar noticia', err);
    }
  }

  async eliminar(id: any) {
    if (!this.usuario || this.usuario.rol !== 'admin') return;
    if (!confirm('¿Eliminar noticia?')) return;
    try {
      const res = await this.noticiasSvc.delete(id, { rol: this.usuario.rol } as any);
      this.toastr.success('✓ Noticia eliminada correctamente', 'Éxito', { positionClass: 'toast-top-right', timeOut: 3000 });
      await this.loadNoticias();
    } catch (err: any) {
      const errMsg = err?.error?.error || err?.message || 'Error al eliminar la noticia';
      this.toastr.error('✗ ' + errMsg, 'Error', { positionClass: 'toast-top-right', timeOut: 3000 });
      console.error('Error eliminar', err);
    }
  }
}
