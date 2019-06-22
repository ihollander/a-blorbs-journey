import Phaser from "phaser";

import Player from "../units/Player";

import { PLAYER_IMAGE, BACKGROUND_IMAGE, TOOTH_IMAGE } from "../consts/images";

import player from "../assets/player.png";
import tooth from "../assets/tooth.png";
import bg from "../assets/space.png";
import healthmeter from '../healthmeter/healthMeter';

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
    this.

    this.player = new Player(
      this,
      this.background.width / 2,
      this.background.height / 2
    );

    // initiating with health maybe 
    this.player.health = 50;
    this.player.maxHealth = 100;
    this.playerHealthMeter = this.game.add.plugin(Phaser.Plugin.HealthMeter);
    this.playerHealthMeter.bar(
      this.player,
      {
        x: 20,
        y: 100,
        width: 100,
        height: 20,
        foreground: #A9A9A9,
        background: #008000,
      }
    )

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
