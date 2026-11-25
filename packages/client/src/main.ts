import Phaser from "phaser";
import { GAME_HEIGHT, GAME_WIDTH } from "./config";
import { TitleScene } from "./scenes/TitleScene";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#9fd3ef",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [TitleScene],
});
