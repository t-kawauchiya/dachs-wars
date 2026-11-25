// シード付き乱数（mulberry32）。同じシードからは必ず同じ列が出る。
// 状態は数値1つなので、ゲームの状態にそのまま保存できる。

export type Rng = {
  /** 0以上1未満の乱数と、次の状態を返す */
  next(state: number): { value: number; state: number };
  /** min以上max以下の整数と、次の状態を返す */
  int(state: number, min: number, max: number): { value: number; state: number };
};

function next(state: number): { value: number; state: number } {
  const s = (state + 0x6d2b79f5) | 0;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, state: s };
}

function int(state: number, min: number, max: number): { value: number; state: number } {
  const r = next(state);
  return { value: min + Math.floor(r.value * (max - min + 1)), state: r.state };
}

export function createRng(): Rng {
  return { next, int };
}
