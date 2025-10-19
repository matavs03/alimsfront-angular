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
export class AdminList implements OnInit{
  admins$!: Observable<Admin[]>

  loggedInAdminName$!: Observable<string>;

  constructor(private adminService: AdminService){}

  ngOnInit(): void{
    this.getAdmins();
    this.loggedInAdminName$ = this.adminService.currentAdmin$.pipe(
      map(admin => admin ? admin.firstName : '')
    );
  }
  
  private getAdmins(){
    this.admins$ = this.adminService.getAdminsList();
  }
}
