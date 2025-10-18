import { ChangeDetectorRef, Component } from '@angular/core';
import { AdminList } from '../admin-list/admin-list';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin-service';
import { MedicationList } from '../medication-list/medication-list';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminList, MedicationList],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  loginForm: FormGroup;
  loginError: string = '';
  loggedIn: boolean = false;

  constructor(private fb: FormBuilder, private adminService: AdminService, private cdRef: ChangeDetectorRef) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onSubmit() {
    
    const { username, password } = this.loginForm.value;

    // Uzimamo sve admine i proveravamo korisnika
    this.adminService.getAdminsList().subscribe(admins => {
      const admin = admins.find(a => a.username === username && a.password === password);

      if(admin) {
        this.loggedIn = true; // login uspešan
        this.adminService.setLoggedInAdmin(admin);
      } else {
        this.loginError = 'Username or password is incorrect';
      }
      this.cdRef.markForCheck();
    });
  }
}
