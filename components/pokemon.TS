
export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
}

export interface Move {
  name: string;
  type: {
    name: string;
    url: string;
  };
}