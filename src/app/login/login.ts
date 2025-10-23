import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminList } from '../admin-list/admin-list';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin-service';
import { MedicationList } from '../medication-list/medication-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminList],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;     // Forma za login
  loginError: string = '';  // Poruka o grešci pri loginu
  loggedIn: boolean = false;  // Status prijave

  constructor(private fb: FormBuilder, private adminService: AdminService, private cdRef: ChangeDetectorRef, private router: Router) {
    this.loginForm = this.fb.group({    // pomocu FormBuilder-a kreiramo formu sa dva polja: username i password, forma je vezana za typescript logiku, ne za html
      username: [''],
      password: ['']
    });
  }

  onSubmit() {

    const { username, password } = this.loginForm.value;      // izvlačimo username i password iz forme


    this.adminService.getAdminsList().subscribe(admins => {
      const admin = admins.find(a => a.username === username && a.password === password);     // tražimo admina sa unetim username-om i password-om

      if (admin) {                                                                              
        this.loggedIn = true;                                                 // ako je pronađen, postavljamo loggedIn na true
        this.adminService.setLoggedInAdmin(admin);                            // i obaveštavamo AdminService o prijavljenom adminu             
        localStorage.setItem('isLoggedIn', 'true');                           // čuvamo status prijave u localStorage-u
      } else {
        this.loginError = 'Username or password is incorrect';                // ako nije pronađen, postavljamo poruku o gresci
      }
      this.cdRef.markForCheck();                                              // osvezavamo prikaz komponente
    });
  }

  
  goToLetter() {                                                              // metoda za navigaciju ka stranici za pravljenje pisma
    if (this.loggedIn) {                                                      // proveravamo da li je korisnik prijavljen
      console.log('Navigating to Make a Letter');
      this.router.navigate(['/makeALetter']);                                 // navigiramo ka stranici za pravljenje pisma
    }
  }

  goToEducationalMaterial() {     
  if (this.loggedIn) {
    const admin = this.adminService.getLoggedInAdmin();
    if (admin) {
      const baseUrl = 'http://localhost:5173';
      const queryParams = `?name=${encodeURIComponent(admin.firstName)}&id=${admin.id}`;
      window.location.href = `${baseUrl}/${queryParams}`;
    }
  }
}
}
