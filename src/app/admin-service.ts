import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Admin } from './admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private baseURL = "http://localhost:8080/api/v1/admins";   // Backend URL za administratore

  private isLoggedIn = false;   // Status prijave

  private loggedInAdminSource = new BehaviorSubject<Admin | null>(null);    // Trenutno prijavljeni administrator
  currentAdmin$ = this.loggedInAdminSource.asObservable();                    // Observable za praćenje prijavljenog administratora

  constructor(private httpClient: HttpClient) {}                              // Injektovanje HttpClient-a

  getAdminsList(): Observable<Admin[]>{                                    // Dohvatanje liste administratora
    return this.httpClient.get<Admin[]>(`${this.baseURL}`);                // GET zahtev ka backendu
  }

  setLoggedInAdmin(admin: Admin) {                                      // Postavljanje prijavljenog administratora
    this.loggedInAdminSource.next(admin);                               // Ažuriranje BehaviorSubject-a
    this.isLoggedIn = true;                                             // Postavljanje statusa prijave na true
  }

  isLoggedInMethod(): boolean {                                          // Provera statusa prijave
    return this.isLoggedIn;                                              // Vraćanje statusa prijave
  }

}
