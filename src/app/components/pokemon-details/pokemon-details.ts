import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonApi } from '../../services/pokemon-api';
import { Pokemon } from '../../models/pokemon';

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pokemon-details.html',
})
export class PokemonDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonApi = inject(PokemonApi);
  private router = inject(Router); // <-- Injecte le Router d'Angular à la place de Location

  public pokemon = signal<Pokemon | null>(null);
  public isLoading = signal<boolean>(true);
  public hasError = signal<boolean>(false);

  ngOnInit(): void {
    // On écoute les changements de paramètres de l'URL pour recharger le composant
    // si l'utilisateur navigue d'un détail à un autre
    this.route.paramMap.subscribe((params) => {
      const idOrName = params.get('id');
      if (idOrName) {
        this.loadPokemon(idOrName);
      }
    });
  }

  private loadPokemon(idOrName: string) {
    this.isLoading.set(true);
    this.pokemonApi.getPokemonByName(idOrName).subscribe({
      next: (data) => {
        if (data) {
          this.pokemon.set(data);
        } else {
          this.hasError.set(true);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  // Modifié : Redirige explicitement et proprement vers la liste principale
  public goBack(): void {
    this.router.navigate(['/pokemons']);
  }
}
