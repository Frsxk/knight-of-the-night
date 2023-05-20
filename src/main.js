import Phaser from "phaser";

import GameScene from "./scenes/GameScene";
import GameOverSCene from "./scenes/GameOverScene";


const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 680,
  physics: {
    default: "arcade",
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [GameScene, GameOverSCene],
};

export default new Phaser.Game(config);
