// ゲームの数値。バランスの調整はこのファイルだけで行う。
// 決まりは docs/game-design.md にある。「仮」と書いた値は、遊んでみて8〜12ターンで決着するように調整する。

export type FoodParams = {
  /** 飛距離 */
  range: number;
  /** におい（何マス先の犬まで気づかせるか） */
  scent: number;
  /** 食いつき（その餌に向かって1ターンに何マス進むか） */
  bite: number;
  /** 満腹感（体重の増え方も比例） */
  fullness: number;
};

// 値はすべて仮。大小の順番だけを game-design.md の「食べ物の種類（v1）」に合わせている。
export const FOODS = {
  jerky: { range: 6, scent: 2, bite: 1, fullness: 10 },
  cheese: { range: 4, scent: 5, bite: 3, fullness: 5 },
  sweetPotato: { range: 2, scent: 3, bite: 2, fullness: 20 },
} as const satisfies Record<string, FoodParams>;

export type FoodKind = keyof typeof FOODS;

/** 足の本数の範囲 */
export const LEGS = { min: 4, max: 10 };

/** 砲台の数の範囲 */
export const CANNONS = { min: 1, max: 3 };

/** 隣のマスとの高低差の上限（段） */
export const MAX_STEP_DIFF = 2;

/** ターン上限（game-design.md でも仮に15） */
export const TURN_LIMIT = 15;

/** 満腹がこの値になると寝て負け */
export const FULLNESS_MAX = 100;

/** 腰の最大値。0になると負け（仮） */
export const BACK_MAX = 100;

/** ステージの列の数（仮） */
export const COLUMNS = 20;
