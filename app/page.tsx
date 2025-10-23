"use client";
import { useEffect, useState } from "react";
import type { Pokemon, Move } from "../components/pokemon";
import { checkEffectiveness, Effectiveness } from "../components/checkEffectiveness";

export default function GamePage() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [move, setMove] = useState<Move | null>(null);
  const [damageRelations, setDamageRelations] = useState<any>(null);

  const [choice, setChoice] = useState<Effectiveness | null>(null);
  const [result, setResult] = useState<Effectiveness | null>(null);
  const [score, setScore] = useState<number>(0);

  // separate reveal states
  const [revealMoveType, setRevealMoveType] = useState(false);
  const [revealDefTypes, setRevealDefTypes] = useState(false);

  // helper: randomize new round
  const newRound = async () => {
    // reset state
    setChoice(null);
    setResult(null);
    setRevealMoveType(false);
    setRevealDefTypes(false);

    // fetch random Pokémon
    const randomId = Math.floor(Math.random() * 151) + 1; // Gen 1
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokeData: Pokemon = await pokeRes.json();
    setPokemon(pokeData);

    // fetch random move
    const randomMoveId = Math.floor(Math.random() * 200) + 1; // first 200 moves
    const moveRes = await fetch(`https://pokeapi.co/api/v2/move/${randomMoveId}`);
    const moveData: Move = await moveRes.json();
    setMove(moveData);

    // fetch damage relations for move type
    const typeRes = await fetch(moveData.type.url);
    const typeData = await typeRes.json();
    setDamageRelations(typeData.damage_relations);
  };

  // initialize first round
  useEffect(() => {
    newRound();
  }, []);

  const handleChoice = (value: Effectiveness) => {
    if (!pokemon || !damageRelations) return;

    setChoice(value);
    const defendingTypes = pokemon.types.map((t) => t.type.name);
    const effectiveness = checkEffectiveness(defendingTypes, damageRelations);
    setResult(effectiveness);

    // update score
    if (value === effectiveness) {
      setScore((prev) => prev + 1);
    }

    // start new round after short delay
    setTimeout(() => {
      newRound();
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Pokémon Type Effectiveness Game</h1>
      <p className="mb-6 text-xl">Score: <strong>{score}</strong></p>

      {pokemon && move ? (
        <div className="bg-white shadow-md rounded p-6 mb-4 text-center">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="mx-auto mb-4"
          />
          <p className="text-lg">
            Defending Pokémon: <strong className="capitalize">{pokemon.name}</strong>
          </p>

          {/* Attacking move name always shown */}
          <p className="text-lg">
            Attacking Move: <strong className="capitalize">{move.name}</strong>
          </p>

          {/* Move type hidden until revealed */}
          {revealMoveType ? (
            <p className="text-lg">Move Type: <strong>{move.type.name}</strong></p>
          ) : (
            <button
              onClick={() => setRevealMoveType(true)}
              className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Reveal Move Type
            </button>
          )}

          {/* Defending types hidden until revealed */}
          {revealDefTypes ? (
            <p className="text-lg">
              Defending Types:{" "}
              {pokemon.types.map((t) => (
                <span key={t.slot} className="mr-2 capitalize">
                  {t.type.name}
                </span>
              ))}
            </p>
          ) : (
            <button
              onClick={() => setRevealDefTypes(true)}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Reveal Defending Types
            </button>
          )}
        </div>
      ) : (
        <p>Loading matchup...</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {["Immune", "Resisted", "Effective", "Super Effective"].map((option) => (
          <button
            key={option}
            onClick={() => handleChoice(option as Effectiveness)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {option}
          </button>
        ))}
      </div>

      {choice && result && (
        <div className="mt-6 text-xl">
          <p>
            You chose: <span className="font-semibold">{choice}</span>
          </p>
          <p>
            Correct answer: <span className="font-semibold">{result}</span>
          </p>
          {choice === result ? (
            <p className="text-green-600 font-bold mt-2">✅ Correct! +1 point</p>
          ) : (
            <p className="text-red-600 font-bold mt-2">❌ Wrong!</p>
          )}
          <p className="text-sm text-gray-500 mt-2">Next round starting...</p>
        </div>
      )}
    </div>
  );
}