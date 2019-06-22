import Phaser from "phaser";

import Player from "../units/Player";
import Blorb from "../units/Blorb";

import {
  PLAYER1_IMAGE,
  PLAYER2_IMAGE,
  PLAYER3_IMAGE,
  PLAYER4_IMAGE,
  PLAYER5_IMAGE,
  BACKGROUND_IMAGE,
  TOOTH_IMAGE
} from "../consts/images";

import player1 from "../assets/player-1.png";
import player2 from "../assets/player-2.png";
import player3 from "../assets/player-3.png";
import player4 from "../assets/player-4.png";
import player5 from "../assets/player-5.png";
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
    this.load.image(PLAYER4_IMAGE, player4);
    this.load.image(PLAYER5_IMAGE, player5);
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


    // initiating with health maybe

    const damageBar = new Phaser.Geom.Rectangle(25, 25, 300, 40)
    let damageGraphics = this.add.graphics({fillStyle: {color: 0xFF0000} })
    damageGraphics.fillRectShape(damageBar)
    damageGraphics.setScrollFactor(0, 0)

    let healthbar = new Phaser.Geom.Rectangle(25, 25, 300, 40)
    let healthGraphics = this.add.graphics({fillStyle: {color: 0x7FFF00} })
    healthGraphics.fillRectShape(healthbar)
    healthGraphics.setScrollFactor(0, 0)

    // this.player.health = 250;

   //  this.healthbar = this.add.text(20, 20, `health: ${this.player.health}`, {
   //   font: "50px Times New Roman",
   //   fill: "#ffffff"
   // });
   // this.healthbar.setScrollFactor(0, 0);


    // this.healthbar.setScrollFactor(0, 0);

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
        // healthbar.scaleX(this.player.health / 350)
        // this.healthbar.setText(`health: ${this.player.health}`);
        powerup.destroy();
        console.log("healthbar", healthbar);
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

    this.enemiesGroup = this.add.group();

    this.maxEnemies = 10;
    // this.enemies = [];

    this.time.addEvent({
      delay: 1000,
      callback: function() {
        // Set all blorbs to random vector
        Array.from(this.enemiesGroup.getChildren()).forEach(function(blorb) {
          blorb.body.velocity.y = Phaser.Math.Between(-100, 100);
          blorb.body.velocity.x = Phaser.Math.Between(-100, 100);
        });

        // New blorb if not too many blorbs
        if (
          Array.from(this.enemiesGroup.getChildren()).length <= this.maxEnemies
        ) {
          var enemy = new Blorb(
            this,
            Phaser.Math.Between(10, this.background.width),
            Phaser.Math.Between(10, this.background.height)
          );
          // Add blorb to group
          this.enemiesGroup.add(enemy);
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


    this.physics.add.collider(
      this.player.sprite,
      this.enemiesGroup,
      (player, enemy) => {
        if (enemy) {
          enemy.destroy();
          this.player.health -= 10;
          // this.healthbar.setText(`health: ${this.player.health}`);
          // console.log("player", player, 'health', this.player.health);
        }
      }
    );
  }

  update() {
    this.player.update();
  }
}
