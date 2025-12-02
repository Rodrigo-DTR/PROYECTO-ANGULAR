PROYECTO ANGULAR — Portal de anuncios ITO

Descripción
- Frontend Angular 16 + Backend Node/Express + MySQL.
- Funcionalidades: autenticación, panel admin de noticias, comentarios por noticia, notificaciones (campana en navbar).

Herramientas de Angular usadas
- Router: `src/app/app-routing.module.ts` — navegación y rutas protegidas.
- Guards: `src/app/services/auth.guard.ts`, `src/app/services/admin.guard.ts` — protegen rutas de usuario y admin.
- Interceptor: `src/app/services/auth.interceptor.ts` — punto para headers/token.
- HttpClient: servicios `auth.service.ts`, `noticias.service.ts`, `comments.service.ts`, `notification.service.ts`.
- Formularios: `FormsModule` y `ReactiveFormsModule` (login/registro/crear noticia).
- Toastr: `ngx-toastr` para notificaciones de UI.
- Signals: `home.component.ts` usa `signal()` para estado reactivo.

Frontend (carpetas clave)
- Componentes: `navbar` (campana) y `comments` (comentarios por noticia).
- Vistas: `home`, `login`, `register`, `profile-edit`, `admin-panel`, `dashboard`.
- Entorno: `src/environments/environment.ts` con `apiBase`.

SQL mínimo (MySQL)
```sql
CREATE TABLE IF NOT EXISTS usuarios (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	rol ENUM('user','admin') DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS noticias (
	id INT AUTO_INCREMENT PRIMARY KEY,
	titulo VARCHAR(255) NOT NULL,
	contenido TEXT NOT NULL,
	imagen_url VARCHAR(255),
	archivo_url VARCHAR(255),
	fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
Probar funcionalidades
- Autenticación (AuthService + Guards + Interceptor)
	1. Regístrate desde la vista Registro o vía `POST /auth/register`.
	2. Inicia sesión en Login. El navbar mostrará tu nombre.
	3. Para ser admin, cambia tu rol en MySQL:
		 ```sql
		 UPDATE usuarios SET rol='admin' WHERE email='tu@correo.com';
		 ```
	4. Abre `/admin` (protegido por `admin.guard.ts`).

- Noticias (Admin Panel)
	1. En “Panel de control” crea una noticia. Aparecerá en Home.
	2. Al crear, se inserta una notificación automáticamente.

- Comentarios (CommentsComponent)
	1. En Home, debajo de cada noticia escribe un comentario y envíalo.
	2. Se guarda en MySQL y se muestra al instante.
	3. Si eres admin, verás “Eliminar” en cada comentario.

- Notificaciones (NotificationService + campana)
	1. Haz clic en la campana del navbar para ver las últimas (actualiza cada 30s).
	2. Botón para admin “Agregar notificaciones recientes” crea notifs para las últimas noticias (usa `POST /notifications/backfill?limit=2`).
