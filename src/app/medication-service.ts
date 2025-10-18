import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Medication } from './medication';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private baseURL = "http://localhost:8080/api/v1/medications";

  constructor(private httpClient: HttpClient) {}

  getMedicationList(): Observable<Medication[]>{
    return this.httpClient.get<Medication[]>(`${this.baseURL}`);
  }
}
