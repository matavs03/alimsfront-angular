import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medication } from './medication';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private baseURL = "http://localhost:8080/api/v1/medications"; // Backend URL sa kog se dobijaju podaci o lekovima

  constructor(private httpClient: HttpClient) {} // Injektovanje HttpClient servisa za pravljenje HTTP zahteva

  getMedicationList(): Observable<Medication[]>{  // Metoda za dobijanje liste lekova
    return this.httpClient.get<Medication[]>(`${this.baseURL}`); // Pravljenje GET zahteva ka backendu
  }
}
