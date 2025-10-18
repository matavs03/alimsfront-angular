import { Routes } from '@angular/router';
import { AdminList } from './admin-list/admin-list';
import { MedicationList } from './medication-list/medication-list';
import { Login } from './login/login';

export const routes: Routes = [
    {path: 'admin', component: Login},
    {path: 'medications', component: MedicationList},
    {path: '', redirectTo: 'medications', pathMatch: 'full'}
];
