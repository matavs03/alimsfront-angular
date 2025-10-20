import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from './admin-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router, private adminService: AdminService) { }

  canActivate(): boolean {
    // ⭐ Koristite AdminService da proverite status
    const loggedIn = this.adminService.isLoggedInMethod(); // Metoda koja proverava da li je admin postavljen

    if (!loggedIn) {
      this.router.navigate(['/admin']);
      return false;
    }
    return true;
  }
}

