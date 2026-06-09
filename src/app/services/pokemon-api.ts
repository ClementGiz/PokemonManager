import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import {
  Pokemon,
  PokemonSpeciesResponse,
  PokemonTypeResponse,
  PokemonTypeSlot,
} from '../models/pokemon';

interface PokeApiListResponse {
  results: Array<{ name: string; url: string }>;
}

@Injectable({ providedIn: 'root' })
export class PokemonApi {
  private http = inject(HttpClient);
  private readonly BASE_URL = 'https://pokeapi.co/api/v2/pokemon?limit=20';

  public getAllPoke(): Observable<Pokemon[]> {
    return this.http.get<PokeApiListResponse>(this.BASE_URL).pipe(
      map((response) => response.results),
      switchMap((pokemonList) => {
        if (pokemonList.length === 0) return of([]);

        const detailRequests = pokemonList.map((p) => {
          const id = p.url.split('/').filter(Boolean).pop();
          return this.fetchCompletePokemon(id!);
        });

        return forkJoin(detailRequests);
      }),
    );
  }

  public switchPoke(offset: number, limit: number = 20): Observable<Pokemon[]> {
    const url = `${this.BASE_URL}&offset=${offset}&limit=${limit}`;

    return this.http.get<PokeApiListResponse>(url).pipe(
      map((response) => response.results),
      switchMap((pokemonList) => {
        if (pokemonList.length === 0) return of([]);

        const detailRequests = pokemonList.map((p) => {
          const id = p.url.split('/').filter(Boolean).pop();
          return this.fetchCompletePokemon(id!);
        });

        return forkJoin(detailRequests);
      }),
    );
  }

  public getPokemonByName(nameOrId: string): Observable<Pokemon | null> {
    const cleanName = nameOrId.toLowerCase().trim();
    return this.fetchCompletePokemon(cleanName).pipe(
      catchError(() => of(null)), // Évite le crash si le Pokémon n'existe pas (404)
    );
  }

  /**
   * MÉTHODE PRIVÉE CENTRALISÉE
   * S'occupe de faire les requêtes imbriquées nécessaires pour un Pokémon (ID ou Nom)
   */
  private fetchCompletePokemon(idOrName: string): Observable<Pokemon> {
    const dataReq = this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);
    const speciesReq = this.http.get<PokemonSpeciesResponse>(
      `https://pokeapi.co/api/v2/pokemon-species/${idOrName}`,
    );

    return forkJoin([dataReq, speciesReq]).pipe(
      switchMap(([pokemonData, speciesData]) => {

        const typeRequests = pokemonData.types.map((t: PokemonTypeSlot) =>
          this.http.get<PokemonTypeResponse>(t.type.url).pipe(
            map((typeData) => {
              const frenchTypeObj = typeData.names.find((n) => n.language.name === 'fr');
              return {
                ...t,
                type: {
                  ...t.type,
                  frenchName: frenchTypeObj ? frenchTypeObj.name : t.type.name,
                },
              };
            }),
          ),
        );

        return forkJoin(typeRequests).pipe(
          map((translatedTypes: PokemonTypeSlot[]) => {
            const frenchNameObj = speciesData.names.find((n) => n.language.name === 'fr');
            const frenchDescObj = speciesData.flavor_text_entries?.find(
              (entry) => entry.language.name === 'fr',
            );
            const cleanDescription = frenchDescObj
              ? frenchDescObj.flavor_text.replace(/[\n\f\r]/g, ' ')
              : 'Aucune description disponible pour ce Pokémon.';

            return {
              ...pokemonData,
              displayName: frenchNameObj ? frenchNameObj.name : pokemonData.name,
              description: cleanDescription,
              types: translatedTypes,
            };
          }),
        );
      }),
    );
  }
}
