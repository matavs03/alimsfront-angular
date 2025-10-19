import { Routes } from '@angular/router';
import { AdminList } from './admin-list/admin-list';
import { Login } from './login/login';
import { LetterList } from './letter-list/letter-list';

export const routes: Routes = [
    {path: 'admin', component: Login},
    {path: 'letters', component: LetterList},
    {path: '', redirectTo: 'letters', pathMatch: 'full'}
];
