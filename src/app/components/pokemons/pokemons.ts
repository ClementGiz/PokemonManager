import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonApi } from '../../services/pokemon-api';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, map, of } from 'rxjs';
import { Pokemon } from '../../models/pokemon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemons',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pokemons.html',
  styleUrl: './pokemons.css',
})
export class Pokemons implements OnInit {
  private pokemonApi = inject(PokemonApi);
  private route = inject(ActivatedRoute);
  public searchInputValue = signal('');
  private searchSubject = new Subject<string>();

  private defaultPokemons = toSignal(this.pokemonApi.getAllPoke(), { initialValue: [] });

  private searchResult = toSignal(
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((query) => {
        if (!query) {
          return of(undefined);
        }
        return this.pokemonApi
          .getPokemonByName(query)
          .pipe(map((pokemon) => (pokemon ? [pokemon] : [])));
      }),
    ),
    { initialValue: undefined },
  );

  public pokemons = computed(() => {
    const search = this.searchResult();
    if (search === undefined) {
      return this.defaultPokemons();
    }
    return search;
  });
  public selectedPokemon = signal<Pokemon | null>(null);
  ngOnInit() {
    // On récupère une fois les "queryParam" du démarrage
    const searchParam = this.route.snapshot.queryParamMap.get('search');

    if (searchParam) {
      this.searchInputValue.set(searchParam); // Met à jour le texte dans l'input HTML
      this.searchSubject.next(searchParam);   // Déclenche la recherche API
    }
  }

  public openPokemonDetails(pokemon: Pokemon) { this.selectedPokemon.set(pokemon); }
  public closePopUp() { this.selectedPokemon.set(null); }

  public onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInputValue.set(input.value);
    this.searchSubject.next(input.value);
  }
}
