import Phaser from "phaser";
import MainGame from "./scenes/MainGame";

var config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  input: {
    gamepad: true
  },
  scene: [MainGame]
};

const game = new Phaser.Game(config);
