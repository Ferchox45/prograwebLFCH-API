import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserListComponent } from './user-list/user-list.component';
import { CharacterTableComponent } from './character-table/character-table.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UserListComponent }, 
      { path: 'character', component: CharacterTableComponent },
    ]
  }
];