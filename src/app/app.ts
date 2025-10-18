import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminList } from './admin-list/admin-list';
import { MedicationList } from './medication-list/medication-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdminList, MedicationList],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('lekovi-front');
}
