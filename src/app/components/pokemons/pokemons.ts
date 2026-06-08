import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonApi } from '../../services/pokemon-api';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, map, of, startWith } from 'rxjs';
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

  // --- GESTION DE LA PAGINATION ---
  public offset = signal<number>(0);
  public limit = 20;
  private pageChangeSubject = new Subject<number>();

  // Chargement des Pokémon par défaut basé sur l'offset actuel
  private defaultPokemons = toSignal(
    this.pageChangeSubject.pipe(
      startWith(0), // Charge la première page (offset 0) au démarrage
      switchMap((currentOffset) => {
        // On passe l'offset actuel au service.
        // Note : On passe false par défaut car on calcule l'offset directement ici
        return this.pokemonApi.switchPoke(currentOffset, 20);
      }),
    ),
    { initialValue: [] },
  );
  // --------------------------------

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

  // Le signal calculé combine la recherche OU la liste paginée par défaut
  public pokemons = computed(() => {
    const search = this.searchResult();
    if (search === undefined) {
      return this.defaultPokemons();
    }
    return search;
  });

  // Permet de savoir dans le HTML si on est en train de chercher (pour masquer les boutons)
  public isSearching = computed(() => this.searchResult() !== undefined);

  public selectedPokemon = signal<Pokemon | null>(null);

  ngOnInit() {
    const searchParam = this.route.snapshot.queryParamMap.get('search');

    if (searchParam) {
      this.searchInputValue.set(searchParam);
      this.searchSubject.next(searchParam);
    }
  }

  // --- MÉTHODES DE PAGINATION ---
  public goToNextPage() {
    this.offset.update((current) => current + this.limit);
    this.pageChangeSubject.next(this.offset());
    this.scrollToTop();
  }

  public goToPreviousPage() {
    if (this.offset() > 0) {
      this.offset.update((current) => current - this.limit);
      this.pageChangeSubject.next(this.offset());
      this.scrollToTop();
    }
  }

  private scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
  // -------------------------------

  public openPokemonDetails(pokemon: Pokemon) {
    this.selectedPokemon.set(pokemon);
  }

  public closePopUp() {
    this.selectedPokemon.set(null);
  }

  public nextPokemon(currentPokemon: Pokemon) {
    const list = this.pokemons();
    const currentIndex = list.findIndex((p) => p.id === currentPokemon.id);
    if (currentIndex !== -1 && currentIndex < list.length - 1) {
      this.selectedPokemon.set(list[currentIndex + 1]);
    }
  }

  public previousPokemon(currentPokemon: Pokemon) {
    const list = this.pokemons();
    const currentIndex = list.findIndex((p) => p.id === currentPokemon.id);
    if (currentIndex > 0) {
      this.selectedPokemon.set(list[currentIndex - 1]);
    }
  }

  public hasPrevious(currentPokemon: Pokemon): boolean {
    return this.pokemons().findIndex((p) => p.id === currentPokemon.id) > 0;
  }

  public hasNext(currentPokemon: Pokemon): boolean {
    const index = this.pokemons().findIndex((p) => p.id === currentPokemon.id);
    return index !== -1 && index < this.pokemons().length - 1;
  }

  public onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInputValue.set(input.value);
    this.searchSubject.next(input.value);
  }
}
