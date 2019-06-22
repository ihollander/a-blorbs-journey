import Phaser from "phaser";

import Player from "../units/Player";

import { PLAYER_IMAGE, BACKGROUND_IMAGE } from "../consts/images";

import bomb from "../assets/bomb.png";
import bg from "../assets/space.png";

export default class MainGame extends Phaser.Scene {
  constructor() {
    super({ key: "MainGame" });
  }

  preload() {
    this.load.image(PLAYER_IMAGE, bomb);
    this.load.image(BACKGROUND_IMAGE, bg);
  }

  create() {
    // background
    this.background = this.add.image(0, 0, BACKGROUND_IMAGE).setOrigin(0, 0);

    this.player = new Player(
      this,
      this.game.canvas.width / 2,
      this.game.canvas.height / 2
    );

    // camera
    // this.cameras.main.setBounds(0, 0, 2000, 2000);
    // this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
  }

  update() {
    this.player.update();
  }
}
