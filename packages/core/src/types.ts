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
  readonly back: number;
  /** 満腹。FULLNESS_MAX で負け */
  readonly fullness: number;
  readonly legs: number;
  readonly cannons: Cannons;
  /** いる列の番号（0から） */
  readonly column: number;
};

/** 地面に落ちた餌 */
export type Food = { readonly kind: FoodKind; readonly column: number };

export type Outcome =
  | { readonly kind: "ongoing" }
  | {
      readonly kind: "win";
      readonly winner: PlayerId;
      readonly reason: "back" | "full" | "timeout";
    }
  | { readonly kind: "draw" };

export type GameState = {
  /** 列ごとの高さ（段） */
  readonly heights: readonly number[];
  /** dogs[0] がプレイヤー0の犬 */
  readonly dogs: readonly [Dog, Dog];
  readonly foods: readonly Food[];
  /** 手番のプレイヤー */
  readonly turn: PlayerId;
  readonly turnCount: number;
  /** 乱数の状態（rng.ts の state） */
  readonly rng: number;
  readonly outcome: Outcome;
};

export type Point = { readonly x: number; readonly y: number };

/**
 * 誰の行動かは state.turn で決まるので、アクションには入れない。
 * shoot の cannon は何門目か（0から）。aim はドラッグの向きと強さで、単位は弾道を作るときに決める。
 */
export type Action =
  | { readonly type: "shoot"; readonly cannon: number; readonly aim: Point }
  | { readonly type: "placeStep"; readonly column: number };

/** 1つの手で起きたことを、起きた順に並べる。画面はこれを順に演出する */
export type GameEvent =
  /** path は弾の軌道、landed は落ちた列 */
  | {
      readonly type: "shot";
      readonly player: PlayerId;
      readonly food: FoodKind;
      readonly path: readonly Point[];
      readonly landed: number;
    }
  /** height は置いたあとの高さ */
  | { readonly type: "stepPlaced"; readonly column: number; readonly height: number }
  | {
      readonly type: "moved";
      readonly player: PlayerId;
      readonly from: number;
      readonly to: number;
    }
  /** fullness は食べたあとの満腹 */
  | {
      readonly type: "ate";
      readonly player: PlayerId;
      readonly food: FoodKind;
      readonly fullness: number;
    }
  /** back はダメージを受けたあとの腰の残り */
  | {
      readonly type: "backDamaged";
      readonly player: PlayerId;
      readonly amount: number;
      readonly back: number;
    }
  | { readonly type: "slept"; readonly player: PlayerId }
  | { readonly type: "ended"; readonly outcome: Outcome };
