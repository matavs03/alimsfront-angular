import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminService } from './admin-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate { //CanActivate može da odluči da li se neka ruta može aktivirati ili ne


  constructor(private router: Router, private adminService: AdminService) { }  //Injektujemo Router i AdminService da bismo mogli da proverimo stanje prijave i da preusmerimo korisnika ako nije prijavljen

  canActivate(): boolean {    //Ova metoda se automatski poziva svaki put kad korisnik pokuša da uđe na neku rutu koja je zaštićena ovim guardom
    const loggedIn = this.adminService.isLoggedInMethod();  
                                                            
    if (!loggedIn) {
      this.router.navigate(['/admin']);
      return false;
    }
    return true;
  }
}

// Čuvar ruta koji proverava da li je korisnik prijavljen pre nego što mu dozvoli pristup određenim rutama

