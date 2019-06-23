import Phaser from "phaser";

import Controller from "../utils/Controller";

import Player from "../units/Player";
import Ammo from "../bullets/Ammo";

import Enemy from "../units/Enemy";
import Blorb from "../units/Blorb";
import EyeballCluster from "../units/EyeballCluster";
import Eyeball from "../units/Eyeball";
import ChaserSmall from "../units/ChaserSmall";
import ChaserLarge from "../units/ChaserLarge";
import Clawber from "../units/Clawber";
import ClawberShot from "../weapons/ClawberShot";

import {
  PLAYER1_IMAGE,
  PLAYER2_IMAGE,
  PLAYER3_IMAGE,
  PLAYER4_IMAGE,
  PLAYER5_IMAGE,
  EYEBALL_IMAGE,
  EYEBALL_CLUSTER_IMAGE,
  CHASER_IMAGE,
  CLAWBER_FULL_IMAGE,
  CLAWBER_HALF_IMAGE,
  CLAWBER_EMPTY_IMAGE,
  DNA_IMAGE,
  BACKGROUND_IMAGE,
  TOOTH_IMAGE,
  NAIL_IMAGE,
  CLAWBER_CLAW_BIG_IMAGE,
  CLAWBER_CLAW_SMALL_IMAGE,
  GAMEOVER_IMAGE
} from "../consts/images";

import {
  SPIT1_SOUND,
  THUM2_SOUND,
  KACHING_SOUND,
  EXPLODE_SOUND,
  SPIT2_SOUND,
  WEOW_SOUND,
  PEPEPEP_SOUND
} from "../consts/sounds";

// image assets
import player1 from "../assets/player-1.png";
import player2 from "../assets/player-2.png";
import player3 from "../assets/player-3.png";
import player4 from "../assets/player-4.png";
import player5 from "../assets/player-5.png";
import tooth from "../assets/tooth.png";
import nail from "../assets/clawber-claw-small.png";
import bg from "../assets/background.png";
import gameOver from "../assets/game-over.png";
import dna from "../assets/dna.png";
import eyeball from "../assets/eyeball.png";
import eyeballCluster from "../assets/eyeball-cluster.png";
import chaser from "../assets/chaser.png";
import clawberFull from "../assets/clawber-full.png";
import clawberHalf from "../assets/clawber-half.png";
import clawberEmpty from "../assets/clawber-empty.png";
import clawberClawBig from "../assets/clawber-claw-big.png";
import clawberClawSmall from "../assets/clawber-claw-small.png";

// sounds
import explode from "../assets/sounds/explode.mp3";
import kaching from "../assets/sounds/kaching.mp3";
import thum2 from "../assets/sounds/thum2.mp3";
import spit1 from "../assets/sounds/spit1.mp3";
import spit2 from "../assets/sounds/spit2.mp3";
import weow from "../assets/sounds/weowweow.mp3";
import pepepepepepepep from "../assets/sounds/pepepepepepepep.mp3";

export default class MainGame extends Phaser.Scene {
  constructor() {
    super({ key: "MainGame" });
  }

  preload() {
    // images
    this.load.image(PLAYER1_IMAGE, player1);
    this.load.image(PLAYER2_IMAGE, player2);
    this.load.image(PLAYER3_IMAGE, player3);
    this.load.image(PLAYER4_IMAGE, player4);
    this.load.image(PLAYER5_IMAGE, player5);
    this.load.image(TOOTH_IMAGE, tooth);
    this.load.image(NAIL_IMAGE, nail);
    this.load.image(BACKGROUND_IMAGE, bg);
    this.load.image(GAMEOVER_IMAGE, gameOver);
    this.load.image(DNA_IMAGE, dna);
    this.load.image(EYEBALL_IMAGE, eyeball);
    this.load.image(EYEBALL_CLUSTER_IMAGE, eyeballCluster);
    this.load.image(CHASER_IMAGE, chaser);
    this.load.image(CLAWBER_FULL_IMAGE, clawberFull);
    this.load.image(CLAWBER_HALF_IMAGE, clawberHalf);
    this.load.image(CLAWBER_EMPTY_IMAGE, clawberEmpty);
    this.load.image(CLAWBER_CLAW_BIG_IMAGE, clawberClawBig);
    this.load.image(CLAWBER_CLAW_SMALL_IMAGE, clawberClawSmall);

    // audio
    this.load.audio(SPIT1_SOUND, spit1);
    this.load.audio(SPIT2_SOUND, spit2);
    this.load.audio(THUM2_SOUND, thum2);
    this.load.audio(EXPLODE_SOUND, explode);
    this.load.audio(KACHING_SOUND, kaching);
    this.load.audio(WEOW_SOUND, weow);
    this.load.audio(PEPEPEP_SOUND, pepepepepepepep);
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
      this.background.width / 2,
      this.background.height / 2
    );

    /*** PHYSICS GROUPS ***/
    // powerups
    this.powerups = this.physics.add.staticGroup();

    // bullets
    this.bulletGroup = this.physics.add.group({
      classType: Ammo
    });

    // camera
    this.cameras.main.setBounds(
      0,
      0,
      this.background.width,
      this.background.height
    );
    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

    // game over graphic
    this.gameOverCard = this.add
      .image(0, 0, GAMEOVER_IMAGE)
      .setDepth(100)
      .setAlpha(0.95)
      .setScale(0.75)
      .setVisible(false);

    this.highScore = this.add
      .text(0, 0, "", {
        font: "50px Times New Roman",
        fill: "#ffffff"
      })
      .setAlign("center")
      .setDepth(1000)
      .setVisible(false);

    this.gameOver = false;

    // enemies
    this.enemiesGroup = this.physics.add.group({
      classType: Enemy
    });

    this.enemyBulletGroup = this.physics.add.group({
      classType: Ammo
    });

    this.killCount = 0;
    this.maxEnemies = 30;

    this.time.addEvent({
      delay: 700,
      callback: function() {
        this.danceBlorbs(this.currentEnemies());
        this.spawnEnemies(this.currentEnemies());
        this.cleanupEnemies(this.currentEnemies());
      }, // End callback for adding enemies
      callbackScope: this,
      loop: true
    });

    // utils
    this.rnd = new Phaser.Math.RandomDataGenerator();

    // check collisions
    this.physics.add.collider(
      this.player,
      this.enemiesGroup,
      this.handlePlayerEnemyCollider.bind(this)
    );

    // check overlaps
    this.physics.add.overlap(
      this.bulletGroup,
      this.enemiesGroup,
      this.handleBulletEnemyCollider.bind(this)
    );

    this.physics.add.overlap(
      this.player,
      this.powerups,
      this.handlePlayerPowerupOverlap.bind(this)
    );

    this.physics.add.collider(
      this.player,
      this.enemyBulletGroup,
      this.handleEnemyBulletPlayerCollider.bind(this)
    );
    // controllers
    this.controller = new Controller(this);
  }

  update() {
    this.controller.update(); // update to get the gamepad info

    if (!this.gameOver) {
      this.player.update();
      this.currentEnemies().forEach(enemy => enemy.update());
      this.currentBullets().forEach(bullet => bullet.update());
    } else if (this.controller.extras.x.isDown) {
      this.scene.restart();
    }

    if (this.controller.extras.esc.isDown) {
      this.scene.stop("MainGame");
      this.scene.start("StartScreen");
    }
  }

  /*** Helper fns ***/
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
    const playerBounds = this.player.getBounds();
    if (currentEnemies.length <= this.maxEnemies) {
      const spawnX = this.rnd.pick([
        Phaser.Math.Between(10, playerBounds.left - 200),
        Phaser.Math.Between(playerBounds.right + 200, this.background.width)
      ]);
      const spawnY = this.rnd.pick([
        Phaser.Math.Between(10, playerBounds.top - 200),
        Phaser.Math.Between(playerBounds.bottom + 200, this.background.height)
      ]);
      const dice = Math.random();
      if (dice > 0.95 && this.player.health >= 150) {
        this.spawnChaserSmall();
      } else if (dice > 0.85 && this.player.health >= 250) {
        this.spawnChaserLarge();
      } else if (dice > 0.75 && this.player.health >= 200) {
        this.spawnClawber();
      } else if (dice > 0.45) {
        this.spawnEyeballCluster(spawnX, spawnY);
      } else {
        this.spawnBlorb(spawnX, spawnY);
      }
    }
  }

  // Spawn a blorb
  spawnBlorb(x, y) {
    this.enemiesGroup.add(new Blorb(this, x, y));
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
    for (let i = 0; i < spawnNum; i++) {
      const eyeball = new Eyeball(this, x, y);
      this.enemiesGroup.add(eyeball);
      eyeball.setInitialVelocity(400);
    }
  }

  spawnChaserSmall() {
    const spawnX =
      this.player.x > this.background.width / 2 ? 0 : this.background.width;
    const spawnY =
      this.player.y > this.background.height / 2 ? 0 : this.background.height;
    const chaser = new ChaserSmall(this, spawnX, spawnY);
    this.enemiesGroup.add(chaser);
  }

  spawnChaserLarge() {
    const spawnX =
      this.player.x > this.background.width / 2 ? 0 : this.background.width;
    const spawnY =
      this.player.y > this.background.height / 2 ? 0 : this.background.height;
    const chaser = new ChaserLarge(this, spawnX, spawnY);
    this.enemiesGroup.add(chaser);
    //play sound
    // this.sound.play("weow");
  }

  spawnClawber() {
    const spawnX =
      this.player.x > this.background.width / 2 ? 0 : this.background.width;
    const spawnY =
      this.player.y > this.background.height / 2 ? 0 : this.background.height;
    const clawber = new Clawber(this, spawnX, spawnY);
    this.enemiesGroup.add(clawber);
  }

  cleanupEnemies(currentEnemies) {
    currentEnemies.forEach(enemy => {
      const { x, y } = enemy.body;
      if (
        x > this.background.width + 100 ||
        x < -100 ||
        y > this.background.height + 100 ||
        y < -100
      ) {
        enemy.destroy();
      }
    });
  }

  handlePlayerPowerupOverlap(player, powerup) {
    this.player.health += 10;
    this.sound.play(KACHING_SOUND, {
      seek: 0.15
    });
    powerup.destroy();
  }

  handlePlayerEnemyCollider(player, enemy) {
    if (enemy) {
      // enemy.damage(1);
      this.player.health -= enemy.collisionDamage;
    }
  }

  handleBulletEnemyCollider(bullet, enemy) {
    if (enemy) {
      enemy.damage(bullet.damage);
      bullet.destroy();
    }
  }

  handleEnemyBulletPlayerCollider(player, bullet) {
    if (player) {
      player.health -= bullet.damage;
      bullet.destroy();
    }
  }

  currentEnemies() {
    return Array.from(this.enemiesGroup.getChildren());
  }

  currentBullets() {
    return Array.from(this.bulletGroup.getChildren());
  }
}
