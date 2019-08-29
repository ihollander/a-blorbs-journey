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

import * as img from "../consts/images";
import * as sound from "../consts/sounds";

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
    this.load.image(img.PLAYER1_IMAGE, player1);
    this.load.image(img.PLAYER2_IMAGE, player2);
    this.load.image(img.PLAYER3_IMAGE, player3);
    this.load.image(img.PLAYER4_IMAGE, player4);
    this.load.image(img.PLAYER5_IMAGE, player5);
    this.load.image(img.TOOTH_IMAGE, tooth);
    this.load.image(img.NAIL_IMAGE, nail);
    this.load.image(img.BACKGROUND_IMAGE, bg);
    this.load.image(img.GAMEOVER_IMAGE, gameOver);
    this.load.image(img.DNA_IMAGE, dna);
    this.load.image(img.EYEBALL_IMAGE, eyeball);
    this.load.image(img.EYEBALL_CLUSTER_IMAGE, eyeballCluster);
    this.load.image(img.CHASER_IMAGE, chaser);
    this.load.image(img.CLAWBER_FULL_IMAGE, clawberFull);
    this.load.image(img.CLAWBER_HALF_IMAGE, clawberHalf);
    this.load.image(img.CLAWBER_EMPTY_IMAGE, clawberEmpty);
    this.load.image(img.CLAWBER_CLAW_BIG_IMAGE, clawberClawBig);
    this.load.image(img.CLAWBER_CLAW_SMALL_IMAGE, clawberClawSmall);

    // audio
    this.load.audio(sound.SPIT1_SOUND, spit1);
    this.load.audio(sound.SPIT2_SOUND, spit2);
    this.load.audio(sound.THUM2_SOUND, thum2);
    this.load.audio(sound.EXPLODE_SOUND, explode);
    this.load.audio(sound.KACHING_SOUND, kaching);
    this.load.audio(sound.WEOW_SOUND, weow);
    this.load.audio(sound.PEPEPEP_SOUND, pepepepepepepep);
  }

  create() {
    // background
    this.background = this.add.image(0, 0, img.BACKGROUND_IMAGE).setOrigin(0, 0);

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
      .image(0, 0, img.GAMEOVER_IMAGE)
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

    this.healthText = this.add
      .text(20, 20, "Score: 0", {
        font: "50px Times New Roman",
        fill: "#ffffff",
        stroke: '#000',
        strokeThickness: 10,
      })
      .setDepth(1000)
      .setScrollFactor(0)

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
      callback: function () {
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

    this.physics.add.collider(
      this.player,
      this.enemyBulletGroup,
      this.handleEnemyBulletPlayerCollider.bind(this)
    );

    this.physics.add.overlap(
      this.bulletGroup,
      this.enemiesGroup,
      this.handleBulletEnemyOverlap.bind(this)
    );

    // check overlaps
    this.physics.add.overlap(
      this.player,
      this.powerups,
      this.handlePlayerPowerupOverlap.bind(this)
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
      this.healthText.setText(`Score: ${this.player.health}`)
    } else if (this.controller.x) {
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
      .filter(enemy => enemy instanceof Blorb)
      .forEach(blorb => blorb.dance());
  }

  getSpawnPosition() {
    const playerBounds = this.player.getBounds();
    const spawnX = this.rnd.pick([
      Phaser.Math.Between(10, playerBounds.left - 200),
      Phaser.Math.Between(playerBounds.right + 200, this.background.width)
    ]);
    const spawnY = this.rnd.pick([
      Phaser.Math.Between(10, playerBounds.top - 200),
      Phaser.Math.Between(playerBounds.bottom + 200, this.background.height)
    ]);
    return [spawnX, spawnY]
  }

  // Choose which enemies to spawn and spawn them
  spawnEnemies(currentEnemies) {
    if (currentEnemies.length <= this.maxEnemies) {
      const [spawnX, spawnY] = this.getSpawnPosition()
      const dice = Math.random();
      if (dice > 0.95 && this.player.highScore >= 170) {
        this.spawnChaserSmall(spawnX, spawnY);
      } else if (dice > 0.85 && this.player.highScore >= 400) {
        this.spawnChaserLarge(spawnX, spawnY);
      } else if (dice > 0.75 && this.player.highScore >= 270) {
        this.spawnClawber(spawnX, spawnY);
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

  spawnEyeballCluster(x, y) {
    const cluster = new EyeballCluster(this, x, y)
    this.enemiesGroup.add(cluster);
    cluster.setInitialVelocity(50);
  }

  spawnEyeballs(x, y, spawnNum) {
    for (let i = 0; i < spawnNum; i++) {
      const eyeball = new Eyeball(this, x, y);
      this.enemiesGroup.add(eyeball);
      eyeball.setInitialVelocity(400);
    }
  }

  spawnChaserSmall(x, y) {
    this.enemiesGroup.add(new ChaserSmall(this, x, y));
  }

  spawnChaserLarge(x, y) {
    this.enemiesGroup.add(new ChaserLarge(this, x, y));
  }

  spawnClawber(x, y) {
    this.enemiesGroup.add(new Clawber(this, x, y));
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
    this.sound.play(sound.KACHING_SOUND, {
      seek: 0.15
    });
    player.powerup();
    powerup.destroy();
    this.controller.rumble(0.1, 250);
  }

  handlePlayerEnemyCollider(player, enemy) {
    player.damage(enemy.collisionDamage);
    this.controller.rumble(0.5, 500);
  }

  handleBulletEnemyOverlap(bullet, enemy) {
    enemy.damage(bullet.damage, () => {
      this.killCount += 1;
      this.sound.play(sound.EXPLODE_SOUND, {
        seek: 1.25
      });

      if (enemy instanceof EyeballCluster) {
        this.spawnEyeballs(
          enemy.x,
          enemy.y,
          Math.floor(Math.random() * 5) + 2
        );
      }

      if (Math.random() < 0.9) {
        this.powerups
          .create(enemy.x, enemy.y, img.DNA_IMAGE)
          .setScale(0.2, 0.2)
          .refreshBody();
      }
    });
    bullet.destroy();
  }

  handleEnemyBulletPlayerCollider(player, bullet) {
    player.damage(bullet.damage);
    bullet.destroy();
  }

  currentEnemies() {
    return Array.from(this.enemiesGroup.getChildren());
  }

  currentBullets() {
    return Array.from(this.bulletGroup.getChildren());
  }
}
