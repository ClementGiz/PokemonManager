export interface GenerationDetail {
  id: number;
  name: string;
  displayName?: string;
  pokemonList: Array<{ name: string; url: string; frenchName?: string; sprite: string; }>;
}

// Interface pour lire la réponse brute de la PokeAPI
export interface GenerationApiResponse {
  id: number;
  name: string;
  names: Array<{ name: string; language: { name: string } }>;
  pokemon_species: Array<{ name: string; url: string }>;
}
