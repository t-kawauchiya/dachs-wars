// 状態・アクション・イベントの形。ルールの処理も画面も、この形でデータをやり取りする。
// 状態は step(state, action) → { state, events } で進め、前の状態は書き換えない（readonly）。

import type { FoodKind } from "./params";

export type PlayerId = 0 | 1;

/** 砲台は1〜3門。1門に食べ物1種類を積む */
export type Cannons =
  | readonly [FoodKind]
  | readonly [FoodKind, FoodKind]
  | readonly [FoodKind, FoodKind, FoodKind];

export type Dog = {
  /** 腰の残り。0で負け */
  back: number;
  /** 満腹。FULLNESS_MAX で負け */
  fullness: number;
  legs: number;
  cannons: Cannons;
  /** いる列の番号（0から） */
  column: number;
};

/** 地面に落ちた餌 */
export type Food = { kind: FoodKind; column: number };

export type Outcome =
  | { kind: "ongoing" }
  | { kind: "win"; winner: PlayerId; reason: "back" | "full" | "timeout" }
  | { kind: "draw" };

export type GameState = {
  /** 列ごとの高さ（段） */
  heights: readonly number[];
  /** dogs[0] がプレイヤー0の犬 */
  dogs: readonly [Dog, Dog];
  foods: readonly Food[];
  /** 手番のプレイヤー */
  turn: PlayerId;
  turnCount: number;
  /** 乱数の状態（rng.ts の state） */
  rng: number;
  outcome: Outcome;
};

export type Point = { x: number; y: number };

/**
 * 誰の行動かは state.turn で決まるので、アクションには入れない。
 * shoot の cannon は何門目か（0から）。aim はドラッグの向きと強さで、単位は弾道を作るときに決める。
 */
export type Action =
  | { type: "shoot"; cannon: number; aim: Point }
  | { type: "placeStep"; column: number };

/** 1つの手で起きたことを、起きた順に並べる。画面はこれを順に演出する */
export type GameEvent =
  /** path は弾の軌道、landed は落ちた列 */
  | { type: "shot"; player: PlayerId; food: FoodKind; path: readonly Point[]; landed: number }
  /** height は置いたあとの高さ */
  | { type: "stepPlaced"; column: number; height: number }
  | { type: "moved"; player: PlayerId; from: number; to: number }
  /** fullness は食べたあとの満腹 */
  | { type: "ate"; player: PlayerId; food: FoodKind; fullness: number }
  /** back はダメージを受けたあとの腰の残り */
  | { type: "backDamaged"; player: PlayerId; amount: number; back: number }
  | { type: "slept"; player: PlayerId }
  | { type: "ended"; outcome: Outcome };
