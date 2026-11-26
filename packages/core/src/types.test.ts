import { describe, expect, it } from "vitest";
import { CANNONS, FOODS, LEGS } from "./params";
import type { Action, Cannons, GameEvent, GameState, Outcome } from "./types";

// 型で禁止したい書き方を並べる。この関数は実行しない。pnpm typecheck が確かめる。
// 各行の上の印（ts-expect-error）は「次の行は型エラーになるはず」という意味で、エラーにならなければ typecheck が失敗する。
function forbidden(s: GameState, a: Action, e: GameEvent, o: Outcome) {
  // 前の状態は書き換えられない
  // @ts-expect-error
  s.turnCount = 1;
  // @ts-expect-error
  s.outcome = { kind: "draw" };
  // @ts-expect-error
  s.heights[0] = 3;
  // @ts-expect-error
  s.dogs[0] = s.dogs[1];
  // @ts-expect-error
  s.dogs[0].back = 0;
  // @ts-expect-error
  s.dogs[0].cannons = ["jerky"];
  // @ts-expect-error
  s.foods[0].column = 3;
  // @ts-expect-error
  a.type = "placeStep";
  // @ts-expect-error
  e.type = "slept";
  // @ts-expect-error
  o.kind = "draw";

  // 数値は書き換えられない
  // @ts-expect-error
  LEGS.min = 1;
  // @ts-expect-error
  CANNONS.max = 4;
  // @ts-expect-error
  FOODS.jerky.range = 1;

  // 砲台は1〜3門で、ない食べ物は積めない
  // @ts-expect-error
  const none: Cannons = [];
  // @ts-expect-error
  const four: Cannons = ["jerky", "cheese", "jerky", "cheese"];
  // @ts-expect-error
  const unknown: Cannons = ["chocolate"];

  // 続いている試合に勝者はいない
  // @ts-expect-error
  const ongoing: Outcome = { kind: "ongoing", winner: 0 };

  return [none, four, unknown, ongoing];
}

describe("types", () => {
  it("型で禁止したい書き方は pnpm typecheck が確かめる", () => {
    expect(forbidden).toBeTypeOf("function");
  });
});
