export type Effectiveness = "Immune" | "Resisted" | "Effective" | "Super Effective";

interface TypeRelation {
  name: string;
  url: string;
}

interface DamageRelations {
  double_damage_to: TypeRelation[];
  half_damage_to: TypeRelation[];
  no_damage_to: TypeRelation[];
}

export function checkEffectiveness(
  defendingTypes: string[],
  damageRelations: DamageRelations
): Effectiveness {
  let multiplier = 1;

  defendingTypes.forEach((defType) => {
    if (damageRelations.no_damage_to.some((t) => t.name === defType)) {
      multiplier *= 0;
    } else if (damageRelations.double_damage_to.some((t) => t.name === defType)) {
      multiplier *= 2;
    } else if (damageRelations.half_damage_to.some((t) => t.name === defType)) {
      multiplier *= 0.5;
    }
  });

  if (multiplier === 0) return "Immune";
  if (multiplier > 1) return "Super Effective";
  if (multiplier < 1) return "Resisted";
  return "Effective";
}