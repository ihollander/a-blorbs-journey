import Phaser from "phaser";

import Player from "../units/Player";
import Blorb from "../units/Blorb";
import Enemy from "../units/Enemy";

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
    this.player.health = 250;

   //  this.healthbar = this.add.text(20, 20, `health: ${this.player.health}`, {
   //   font: "50px Times New Roman",
   //   fill: "#ffffff"
   // });
   // this.healthbar.setScrollFactor(0, 0);

    const testbar = new Phaser.Geom.Rectangle(25, 25, 300, 40)
    let graphics = this.add.graphics({fillStyle: {color: 0x0000ff} })
    graphics.fillRectShape(testbar)

    graphics.setScrollFactor(0, 0)
    // this.healthbar.setScrollFactor(0, 0);

    // powerups temp
    this.powerups = this.physics.add.staticGroup();

    // camera
    this.cameras.main.setBounds(
      0,
      0,
      this.background.width,
      this.background.height
    );
    this.cameras.main.startFollow(this.player.sprite, true, 0.5, 0.5);

    this.enemiesGroup = this.physics.add.group({
      classType: Enemy
    });

    this.maxEnemies = 10;
    // this.enemies = [];

    this.time.addEvent({
      delay: 1000,
      callback: function() {
        const enemiesArray = Array.from(this.enemiesGroup.getChildren());
        // Set all blorbs to random vector
        enemiesArray.forEach(function(blorb) {
          blorb.body.velocity.y = Phaser.Math.Between(-100, 100);
          blorb.body.velocity.x = Phaser.Math.Between(-100, 100);
        });

        // New blorb if not too many blorbs
        if (enemiesArray.length <= this.maxEnemies) {
          var enemy = new Blorb(
            this,
            Phaser.Math.Between(10, this.background.width),
            Phaser.Math.Between(10, this.background.height)
          );
          // Add blorb to group
          this.enemiesGroup.add(enemy);
          // this.enemiesGroup.create()
        }
      }, // End callback for adding enemies
      callbackScope: this,
      loop: true
    });

    // check collisions
    this.physics.add.collider(
      this.player.bulletGroup,
      this.enemiesGroup,
      this.handleBulletEnemyCollider.bind(this)
    );


    this.physics.add.collider(
      this.player.sprite,
      this.enemiesGroup,
      this.handlePlayerEnemyCollider.bind(this)
    );

    // check overlaps
    this.physics.add.overlap(
      this.player.sprite,
      this.powerups,
      this.handlePlayerPowerupOverlap.bind(this)
    );
  }

  update() {
    this.player.update();
  }

  handlePlayerPowerupOverlap(player, powerup) {
    this.player.health += 10;
    this.healthbar.setText(`health: ${this.player.health}`);
    powerup.destroy();
  }

  handlePlayerEnemyCollider(player, enemy) {
    if (enemy) {
      enemy.destroy();
      this.player.health -= 10;
      this.healthbar.setText(`health: ${this.player.health}`);
    }
  }

  handleBulletEnemyCollider(bullet, enemy) {
    if (enemy) {
      console.log(enemy);

      const chance = Math.random();
      if (chance < 0.3) {
        this.powerups.create(enemy.body.x, enemy.body.y, "bomb").setScale(2);
      }
      enemy.destroy();
      bullet.destroy();
    }
  }
}
