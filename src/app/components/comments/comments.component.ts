import { Component, Input, OnInit } from '@angular/core';
import { CommentsService, CommentItem } from '../../services/comments.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  @Input() noticiaId!: string;
  comments: CommentItem[] = [];
  texto = '';
  loading = false;

  constructor(private commentsSvc: CommentsService, private toastr: ToastrService) {}

  ngOnInit() { this.fetch(); }

  async fetch() {
    if (!this.noticiaId) return;
    this.loading = true;
    this.commentsSvc.list(this.noticiaId).subscribe({
      next: (list) => { this.comments = list; this.loading = false; },
      error: () => { this.toastr.error('Error cargando comentarios'); this.loading = false; }
    });
  }

  async send() {
    if (!this.texto.trim()) { this.toastr.warning('Escribe un comentario'); return; }
    this.commentsSvc.create(this.noticiaId, this.texto.trim()).subscribe({
      next: (c) => { this.texto = ''; this.comments.unshift(c); },
      error: () => this.toastr.error('No se pudo enviar el comentario')
    });
  }

  deleteComment(id: string) {
    this.commentsSvc.delete(id).subscribe({
      next: () => { this.comments = this.comments.filter(c => c.id !== id); },
      error: () => this.toastr.error('No se pudo eliminar el comentario')
    });
  }

  get isAdmin() { return (localStorage.getItem('rol') || '') === 'admin'; }
}
