import { Routes } from '@angular/router';
import { AdminList } from './admin-list/admin-list';
import { Login } from './login/login';
import { LetterList } from './letter-list/letter-list';
import { AuthGuard } from './auth-guard';
import { MedicationList } from './medication-list/medication-list';

export const routes: Routes = [
    { path: 'admin', component: Login },
    { path: 'letters', component: LetterList},
    { path: 'makeALetter', component: MedicationList, canActivate: [AuthGuard] },      //AuthGuard za zastitu ruta
    { path: 'makeAEducationalMaterial', component: LetterList, canActivate: [AuthGuard] },   //AuthGuard za zastitu ruta
    { path: '', redirectTo: 'letters', pathMatch: 'full' }              // Podrazumevana ruta
];

// Definisanje ruta aplikacije
