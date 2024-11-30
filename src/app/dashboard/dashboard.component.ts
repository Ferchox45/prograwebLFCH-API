import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service'; 
import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
}

)


export class DashboardComponent implements OnInit {
  menuItems = [
    { name: 'Users', link: '/dashboard/users' },
    { name: 'Rick-and-Morty', link: '/dashboard/character' }
  ];
  currentUser: any = null; 

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.userService.getCurrentUser();
  }

  logout(): void {
    localStorage.removeItem('token'); // Cambia 'token' por la clave que estés usando
    localStorage.removeItem('user'); // Limpia otros datos si es necesario
    sessionStorage.clear(); // Limpia datos temporales si es necesario
    this.router.navigate(['/login']); 
  }
}
