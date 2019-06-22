import Phaser from "phaser";

import Player from "../units/Player";
import Enemy from "../units/Enemy";
import Blorb from "../units/Blorb";
import EyeballCluster from "../units/EyeballCluster";
import Eyeball from "../units/Eyeball";

import {
  PLAYER1_IMAGE,
  PLAYER2_IMAGE,
  PLAYER3_IMAGE,
  PLAYER4_IMAGE,
  EYEBALL_IMAGE,
  BACKGROUND_IMAGE,
  TOOTH_IMAGE
} from "../consts/images";

import player1 from "../assets/player-1.png";
import player2 from "../assets/player-2.png";
import player3 from "../assets/player-3.png";
import player4 from "../assets/player-4.png";
import tooth from "../assets/tooth.png";
import bg from "../assets/space.png";
import bomb from "../assets/bomb.png";
import eyeball from "../assets/eyeball.png";

export default class MainGame extends Phaser.Scene {
  constructor() {
    super({ key: "MainGame" });
  }

  preload() {
    this.load.image(PLAYER1_IMAGE, player1);
    this.load.image(PLAYER2_IMAGE, player2);
    this.load.image(PLAYER3_IMAGE, player3);
    this.load.image(PLAYER4_IMAGE, player4);
    this.load.image(TOOTH_IMAGE, tooth);
    this.load.image(BACKGROUND_IMAGE, bg);
    this.load.image("bomb", bomb);
    this.load.image(EYEBALL_IMAGE, eyeball);
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
    this.player.health = 50;

    this.healthbar = this.add.text(20, 20, `health: ${this.player.health}`, {
      font: "50px Times New Roman",
      fill: "#ffffff"
    });
    this.healthbar.setScrollFactor(0, 0);

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
        this.healthbar.setText(`health: ${this.player.health}`);
        powerup.destroy();
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

    this.enemiesGroup = this.physics.add.group({
      classType: Enemy
    });

    this.maxEnemies = 10;
    // this.enemies = [];

    this.time.addEvent({
      delay: 1000,
      callback: function() {
        const currentEnemies = Array.from(this.enemiesGroup.getChildren());

        this.danceBlorbs(currentEnemies);
        this.spawnEnemies(currentEnemies);
      }, // End callback for adding enemies

      callbackScope: this,
      loop: true
    });

    this.physics.add.collider(
      this.player.bulletGroup,
      this.enemiesGroup,
      (bullet, enemy) => {
        if (enemy) {
          enemy.damage(1);
          bullet.destroy();
        }
      }
    );
  }

  // Set all blorbs to random vector
  danceBlorbs(currentEnemies) {
    currentEnemies
      .filter(enemy => enemy.constructor.name === "Blorb")
      .forEach(function(blorb) {
        blorb.dance();
      });
  }

  // Choose which enemies to spawn and spawn them
  spawnEnemies(currentEnemies) {
    if (currentEnemies.length <= this.maxEnemies) {
      if (Math.random() > 0.5) {
        this.spawnBlorb();
      } else {
        this.spawnEyeballCluster();
      }
    }
  }

  // Spawn a blorb
  spawnBlorb() {
    this.enemiesGroup.add(
      new Blorb(
        this,
        Phaser.Math.Between(10, this.background.width),
        Phaser.Math.Between(10, this.background.height)
      )
    );
  }

  spawnEyeballCluster() {
    const eyeballCluster = new EyeballCluster(
      this,
      Phaser.Math.Between(10, this.background.width),
      Phaser.Math.Between(10, this.background.height)
    );
    this.enemiesGroup.add(eyeballCluster);
    eyeballCluster.setInitialVelocity(50);
  }

  spawnEyeballs(spawnNum, x, y) {
    console.log(`Spawning ${spawnNum} eyeballs!`);
    for (let i = 0; i < spawnNum; i++) {
      const eyeball = new Eyeball(this, x, y);
      this.enemiesGroup.add(eyeball);
      eyeball.setInitialVelocity(400);
    }
  }

  update() {
    this.player.update();
  }
}
