"use client";
import { useEffect, useState } from "react";
import type { Pokemon } from "../components/pokemon";

export default function PokedexPage() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  const fetchRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 151) + 1; // Gen 1
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data: Pokemon = await res.json();
    setPokemon(data);
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Pokédex Viewer</h1>

      {pokemon ? (
        <div className="bg-white shadow-md rounded p-6 text-center">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="mx-auto mb-4"
          />
          <p className="text-xl capitalize font-semibold">{pokemon.name}</p>
          <p className="mt-2">
            Types:{" "}
            {pokemon.types.map((t) => (
              <span key={t.slot} className="mr-2 capitalize">
                {t.type.name}
              </span>
            ))}
          </p>
          <button
            onClick={fetchRandomPokemon}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show Another Pokémon
          </button>
        </div>
      ) : (
        <p>Loading Pokémon...</p>
      )}
    </div>
  );
}