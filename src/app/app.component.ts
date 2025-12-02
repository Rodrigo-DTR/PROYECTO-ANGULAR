import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <main class="main-content container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent { }
