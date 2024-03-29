import { Component } from '@angular/core';

@Component({
  selector: 'app-app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent {
  isPanelVisible = false;

  togglePanel() {
    this.isPanelVisible = !this.isPanelVisible;
  }
}
