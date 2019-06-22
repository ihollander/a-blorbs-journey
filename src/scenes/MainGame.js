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

    // camera
    this.cameras.main.setBounds(
      0,
      0,
      this.background.width,
      this.background.height
    );
    this.cameras.main.startFollow(this.player.sprite, true, 0.5, 0.5);

    this.enemiesGroup = this.add.group();

    this.maxEnemies = 10;
    // this.enemies = [];

    this.time.addEvent({
      delay: 1000,
      callback: function() {
        // Set all blorbs to random vector
        console.log(this.enemiesGroup.getChildren());
        Array.from(this.enemiesGroup.getChildren).forEach(function(blorb) {
          blorb.body.velocity.y = Phaser.Math.Between(-100, 100);
          blorb.body.velocity.x = Phaser.Math.Between(-100, 100);
        });

        // New blorb if not too many blorbs
        if (this.enemies.length <= this.maxEnemies) {
          var enemy = new Blorb(
            this,
            Phaser.Math.Between(10, this.background.width),
            Phaser.Math.Between(10, this.background.height)
          );
          // Add blorb to group
          this.enemiesGroup.add(blorb);
        }
      }, // End callback for adding enemies

      callbackScope: this,
      loop: true
    });

    this.physics.add.collider(
      this.player.bulletGroup,
      this.enemiesGroup,
      function(bullet, enemy) {
        if (enemy) {
          enemy.destroy();
          bullet.destroy();
        }
      }
    );
  }

  update() {
    this.player.update();
  }
}
