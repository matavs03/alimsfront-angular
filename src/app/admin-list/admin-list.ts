import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Admin } from '../admin';
import { AdminService } from '../admin-service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-list.html',
  styleUrls: ['./admin-list.css']
})
export class AdminList implements OnInit{               //definisanje komponente, OnInit za inicijalizaciju
  admins$!: Observable<Admin[]>;         //lista admin, $ oznacava da je Observable

  loggedInAdminName$!: Observable<string>;      //ime ulogovanog admina

  constructor(private adminService: AdminService){}      //injektovanje servisa

  ngOnInit(): void{                                                     //inicijalizacija komponente
    this.getAdmins();                                                //pozivanje metode za dobijanje liste admina                   
    this.loggedInAdminName$ = this.adminService.currentAdmin$.pipe(    //dobijanje imena ulogovanog admina
      map(admin => admin ? admin.firstName : '')                        //mapiranje Observable objekta da bi se izvuklo ime
    );
  }
  
  private getAdmins(){                                            //metoda za dobijanje liste admina
    this.admins$ = this.adminService.getAdminsList();             //uzimanje Observable liste admina iz servisa
  }
}
