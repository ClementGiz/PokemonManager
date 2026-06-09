import { Injectable, signal } from '@angular/core';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly STORAGE_KEY = 'app_users';

  currentUser = signal<User | null>(this.getInitialUser());

  private getInitialUser(): User | null {
    const userJson = sessionStorage.getItem('current_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  constructor() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  getUsers(): User[] {
    const usersJson = localStorage.getItem(this.STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  registerUser(newUser: User): { success: boolean; message: string } {
    const users = this.getUsers();

    const emailExists = users.some((user) => user.email.toLowerCase() === newUser.email.toLowerCase());
    if (emailExists) {
      return { success: false, message: 'Cette adresse email est déjà utilisée.' };
    }

    const nameExists = users.some((user) => user.name.toLowerCase() === newUser.name.toLowerCase());
    if (nameExists) {
      return { success: false, message: 'Ce pseudo est déjà utilisé.' };
    }

    const userToSave: User = {
      ...newUser,
      id: crypto.randomUUID(),
    };

    users.push(userToSave);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    return { success: true, message: 'Inscription réussie !' };
  }

  loginUser(email: string, password: string): { success: boolean; user?: User } {
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (user && user.password && user.password === password) {
      const { password, ...userWithoutPassword } = user;
      sessionStorage.setItem('current_user', JSON.stringify(userWithoutPassword));
      this.currentUser.set(userWithoutPassword);
      return { success: true, user: userWithoutPassword };
    }

    return { success: false };
  }

  logout() {
    sessionStorage.removeItem('current_user');
    this.currentUser.set(null);
  }
}
