// ゲームのルール。Phaserにもブラウザにも依存しない純粋なTypeScript。
// 状態は step(state, action) → { state, events } で進める（実装はこれから）。
export * from "./params";
export { createRng, type Rng } from "./rng";
export * from "./types";
