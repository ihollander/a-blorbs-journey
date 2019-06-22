import Phaser from "phaser";

import Player from "../units/Player";

import { PLAYER_IMAGE, BACKGROUND_IMAGE, TOOTH_IMAGE } from "../consts/images";

import player from "../assets/player.png";
import tooth from "../assets/tooth.png";
import bg from "../assets/space.png";

export default class MainGame extends Phaser.Scene {
  constructor() {
    super({ key: "MainGame" });
  }

  preload() {
    this.load.image(PLAYER_IMAGE, player);
    this.load.image(TOOTH_IMAGE, tooth);
    this.load.image(BACKGROUND_IMAGE, bg);
  }

  create() {
    // background
    this.background = this.add.image(0, 0, BACKGROUND_IMAGE).setOrigin(0, 0);

    this.physics.world.setBounds(
      0,
      0,
      this.background.width,
      this.background.height
    );

    this.player = new Player(
      this,
      this.background.width / 2,
      this.background.height / 2
    );

    // initiating with health maybe
    this.player.health = 50;

    this.healthbar = this.add.text(20, 20, `health: ${this.player.health}`, { font: "50px Times New Roman", fill: "#ffffff"});
    this.healthbar.setScrollFactor(0, 0)

    // camera
    this.cameras.main.setBounds(
      0,
      0,
      this.background.width,
      this.background.height
    );
    this.cameras.main.startFollow(this.player.sprite, true, 0.5, 0.5);

  }

  update() {
    this.player.update();
  }
}
