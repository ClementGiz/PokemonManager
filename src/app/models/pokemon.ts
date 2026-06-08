export interface Pokemon {
  id: number;
  name: string;
  displayName?: string;
  types: PokemonTypeSlot[];
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  description?: string;
}

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
    frenchName?: string;
  };
}

export interface PokemonSpeciesResponse {
  names: Array<{
    name: string;
    language: { name: string };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
    version: { name: string };
  }>;
}

export interface PokemonTypeResponse {
  names: Array<{
    name: string;
    language: { name: string };
  }>;
}
