import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.html',
  styleUrl: '../../app.css',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);

  user = {
    email: '',
    password: '',
  };
  errorMessage = '';

  public onSubmit() {
    this.errorMessage = '';

    const result = this.auth.loginUser(this.user.email, this.user.password);

    if (result.success) {
      sessionStorage.setItem('current_user', JSON.stringify(result.user));
      alert(`Bienvenue, ${result.user?.name} !`);
      this.router.navigate(['/profil']);
    } else {
      this.errorMessage = "L'adresse email ou le mot de passe est incorrect.";
    }
  }
}
