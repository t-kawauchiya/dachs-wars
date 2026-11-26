import { describe, expect, it } from "vitest";
import { CANNONS, FOODS, LEGS, MAX_STEP_DIFF, TURN_LIMIT } from "./params";

// docs/game-design.md の決定に合っているかを確かめる。仮の値は、大小の順番だけを確かめる。
describe("params", () => {
  it("足は4〜10本", () => {
    expect(LEGS).toEqual({ min: 4, max: 10 });
  });

  it("砲台は1〜3門", () => {
    expect(CANNONS).toEqual({ min: 1, max: 3 });
  });

  it("隣のマスとの高低差は2段まで", () => {
    expect(MAX_STEP_DIFF).toBe(2);
  });

  it("ターン上限は15", () => {
    expect(TURN_LIMIT).toBe(15);
  });

  it("飛距離はジャーキー > チーズ > さつまいも", () => {
    expect(FOODS.jerky.range).toBeGreaterThan(FOODS.cheese.range);
    expect(FOODS.cheese.range).toBeGreaterThan(FOODS.sweetPotato.range);
  });

  it("においはチーズ > さつまいも > ジャーキー", () => {
    expect(FOODS.cheese.scent).toBeGreaterThan(FOODS.sweetPotato.scent);
    expect(FOODS.sweetPotato.scent).toBeGreaterThan(FOODS.jerky.scent);
  });

  it("食いつきはチーズ > さつまいも > ジャーキー", () => {
    expect(FOODS.cheese.bite).toBeGreaterThan(FOODS.sweetPotato.bite);
    expect(FOODS.sweetPotato.bite).toBeGreaterThan(FOODS.jerky.bite);
  });

  it("満腹感はさつまいも > ジャーキー > チーズ", () => {
    expect(FOODS.sweetPotato.fullness).toBeGreaterThan(FOODS.jerky.fullness);
    expect(FOODS.jerky.fullness).toBeGreaterThan(FOODS.cheese.fullness);
  });
});
