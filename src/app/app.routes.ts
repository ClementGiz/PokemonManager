import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'generations',
    loadComponent: () => import('./components/generations/generations').then((m) => m.Generations),
  },
  {
    path: 'pokemons',
    loadComponent: () => import('./components/pokemons/pokemons').then((m) => m.Pokemons),
  },
  { path : 'pokemons/:id', loadComponent: () => import('./components/pokemon-details/pokemon-details').then((m) => m.PokemonDetails),},
  { path: '', redirectTo: '/pokemons', pathMatch: 'full' },
  { path: 'login',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),},
  { path : 'profil',
    loadComponent: () => import('./components/profil/profil').then(m => m.Profil),
    canActivate: [authGuard]
  },
  { path: 'register', loadComponent: () => import('./components/register/register').then((m) => m.Register),},
  { path: '**', loadComponent: () => import('./components/pokemons/pokemons').then((m) => m.Pokemons) },
];
