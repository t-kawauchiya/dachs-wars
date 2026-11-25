import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "../config";

// 土台の動作確認用の仮タイトル画面
export class TitleScene extends Phaser.Scene {
  constructor() {
    super("title");
  }

  create(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, GAME_WIDTH, 120, 0x4f9a4a);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "腰がいのち ダックス大戦", {
        fontFamily: "sans-serif",
        fontSize: "64px",
        color: "#2b1d14",
        fontStyle: "bold",
      })
      .setOrigin(0.5);
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, "準備中…", {
        fontFamily: "sans-serif",
        fontSize: "28px",
        color: "#6e3a17",
      })
      .setOrigin(0.5);
  }
}
