import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminList } from './admin-list/admin-list';
import { MedicationList } from './medication-list/medication-list';

@Component({
  selector: 'app-root',       // Selektor glavne komponente
  standalone: true,           // Oznacava da je komponenta samostalna
  imports: [RouterOutlet],    // Uvoz potrebnih modula
  templateUrl: './app.html',  // Putanja do HTML templejta
  styleUrls: ['./app.css']    // Putanja do CSS stilova
})
export class App {
  protected readonly title = signal('lekovi-front');
}

// Glavna (root) komponenta aplikacije
