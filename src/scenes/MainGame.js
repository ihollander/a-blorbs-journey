import Phaser from "phaser";

import Player from "../units/Player";
import Blorb from "../units/Blorb";

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
    // this.load.image(BLORB_IMAGE, blorb);
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

    this.blorb = new Blorb(
      this,
      this.background.width / 2,
      this.background.height / 2
    );

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
