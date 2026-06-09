import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profil',
  imports: [RouterLink],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})
export class Profil implements OnInit {
  protected auth = inject(Auth);
  private router = inject(Router);

  ngOnInit(): void {
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
