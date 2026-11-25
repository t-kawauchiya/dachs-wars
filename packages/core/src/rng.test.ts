import { describe, expect, it } from "vitest";
import { createRng } from "./rng";

describe("rng", () => {
  const rng = createRng();

  it("同じシードからは同じ列が出る", () => {
    const seq = (seed: number) => {
      let s = seed;
      return Array.from({ length: 5 }, () => {
        const r = rng.next(s);
        s = r.state;
        return r.value;
      });
    };
    expect(seq(42)).toEqual(seq(42));
    expect(seq(42)).not.toEqual(seq(43));
  });

  it("int は範囲内の整数を返す", () => {
    let s = 1;
    for (let i = 0; i < 1000; i++) {
      const r = rng.int(s, 2, 5);
      s = r.state;
      expect(Number.isInteger(r.value)).toBe(true);
      expect(r.value).toBeGreaterThanOrEqual(2);
      expect(r.value).toBeLessThanOrEqual(5);
    }
  });
});
