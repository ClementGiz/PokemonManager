import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { GenerationApiResponse, GenerationDetail } from '../models/generation'; // Ajuste le chemin
import { PokemonSpeciesResponse } from '../models/pokemon';

@Injectable({ providedIn: 'root' })
export class GenerationApi {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'https://pokeapi.co/api/v2/generation';

  public getAllGen() {
    return this.http
      .get<{ results: Array<{ name: string; url: string }> }>(this.BASE_URL)
      .pipe(map((response) => response.results));
  }

  /**
   * Récupère les détails d'une génération avec le nom FR et tous ses Pokémon traduits
   */
  public getGenerationDetails(idOrName: string): Observable<GenerationDetail> {
    return this.http.get<GenerationApiResponse>(`${this.BASE_URL}/${idOrName}`).pipe(
      switchMap((genData) => {
        const frenchNameObj = genData.names.find((n) => n.language.name === 'fr');
        const displayName = frenchNameObj ? frenchNameObj.name : genData.name;

        const pokemonRequests = genData.pokemon_species.map((p) => {
          const id = p.url.split('/').filter(Boolean).pop() || '0';
          const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

          return this.http
            .get<PokemonSpeciesResponse>(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
            .pipe(
              map((species) => {
                const fName = species.names.find((n) => n.language.name === 'fr');
                return {
                  name: p.name,
                  url: p.url,
                  frenchName: fName ? fName.name : p.name,
                  sprite: spriteUrl,
                };
              }),
            );
        });

        return forkJoin(pokemonRequests).pipe(
          map((translatedPokemons) => {
            const sortedPokemons = translatedPokemons.sort((a, b) => {
              const idA = parseInt(a.url.split('/').filter(Boolean).pop() || '0');
              const idB = parseInt(b.url.split('/').filter(Boolean).pop() || '0');
              return idA - idB;
            });

            return {
              id: genData.id,
              name: genData.name,
              displayName: displayName,
              pokemonList: sortedPokemons,
            };
          }),
        );
      }),
    );
  }
}
