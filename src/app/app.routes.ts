import { Routes } from '@angular/router';
import { Generations } from './components/generations/generations';
import { Pokemons } from './components/pokemons/pokemons';

export const routes: Routes = [
  { path: 'generations', component: Generations },
  { path: 'pokemons', component: Pokemons },
  { path: '', redirectTo: '/pokemons', pathMatch: 'full' },
];
