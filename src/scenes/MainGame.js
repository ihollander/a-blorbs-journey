import Phaser from "phaser";

import Player from "../units/Player";

import {
  PLAYER1_IMAGE,
  PLAYER2_IMAGE,
  PLAYER3_IMAGE,
  BACKGROUND_IMAGE,
  TOOTH_IMAGE
} from "../consts/images";

import player1 from "../assets/player-1.png";
import player2 from "../assets/player-2.png";
import player3 from "../assets/player-3.png";
import tooth from "../assets/tooth.png";
import bg from "../assets/space.png";
import bomb from "../assets/bomb.png";

export default class MainGame extends Phaser.Scene {
  constructor() {
    super({ key: "MainGame" });
  }

  preload() {
    this.load.image(PLAYER1_IMAGE, player1);
    this.load.image(PLAYER2_IMAGE, player2);
    this.load.image(PLAYER3_IMAGE, player3);
    this.load.image(TOOTH_IMAGE, tooth);
    this.load.image(BACKGROUND_IMAGE, bg);
    this.load.image("bomb", bomb);
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

    // player
    this.player = new Player(
      this,
      this.background.width / 4, // starting position
      this.background.height / 2
    );

    // powerups temp
    this.powerups = this.physics.add.staticGroup();
    // random gen
    for (let i = 1; i <= 40; i++) {
      const x = Phaser.Math.Between(0, this.background.width);
      const y = Phaser.Math.Between(0, this.background.height);

      this.powerups.create(x, y, "bomb").setScale(2);
    }
    // check overlap
    this.physics.add.overlap(
      this.player.sprite,
      this.powerups,
      (player, powerup) => {
        this.player.health += 10;
        powerup.destroy();
        console.log("Health: ", this.player.health);
      }
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
