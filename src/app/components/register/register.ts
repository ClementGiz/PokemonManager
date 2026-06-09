import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../models/user';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../../app.css',
})
export class Register {
  private auth = inject(Auth);
  private router = inject(Router);

  user: User = { name: '', email: '', password: '' };
  errorMessage = '';

  public onSubmit() {
    const result = this.auth.registerUser(this.user);

    if (result.success) {
      alert(result.message);
      this.router.navigate(['/login']);
    } else {
      this.errorMessage = result.message;
    }
  }
}
