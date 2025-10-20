import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Admin } from './admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private baseURL = "http://localhost:8080/api/v1/admins";

  private isLoggedIn = false;

  private loggedInAdminSource = new BehaviorSubject<Admin | null>(null);
  currentAdmin$ = this.loggedInAdminSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  getAdminsList(): Observable<Admin[]>{
    return this.httpClient.get<Admin[]>(`${this.baseURL}`);
  }

  setLoggedInAdmin(admin: Admin) {
    this.loggedInAdminSource.next(admin);
    this.isLoggedIn = true;
  }

  isLoggedInMethod(): boolean {
    return this.isLoggedIn;
  }

}
