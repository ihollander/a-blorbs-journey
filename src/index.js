import Phaser from "phaser";
import StartScreen from "./scenes/StartScreen";
import MainGame from "./scenes/MainGame";

const config = {
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
  scene: [StartScreen, MainGame]
};

const game = new Phaser.Game(config);
