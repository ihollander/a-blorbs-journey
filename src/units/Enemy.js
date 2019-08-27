import Phaser from "phaser";

import { DNA_IMAGE } from "../consts/images";
import { EXPLODE_SOUND } from "../consts/sounds";

export default class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setData("type", type);
    this.setData("isDead", false);
    this.body.setCollideWorldBounds(true);
    this.angle = Math.random() * 360;

    this.health = 10;
    this.suffering = false;

    this.collisionDamage = 10;
  }

  damage(x, onEnemyDestroyed) {
    if (this.suffering === false) {
      this.health -= x;

      if (this.health <= 0) {
        onEnemyDestroyed();
        if (this.sound) {
          this.sound.stop();
        }
        this.destroy();
      } else {
        this.suffer();
      }
    }
  }

  killMe() {
    this.scene.killCount += 1;
    // debugger;
    this.scene.sound.play(EXPLODE_SOUND, {
      seek: 1.25
    });
    const chance = Math.random();
    if (chance < 0.9) {
      this.scene.powerups
        .create(this.body.x, this.body.y, DNA_IMAGE)
        .setScale(0.2, 0.2)
        .refreshBody(); // must call after setScale to resize
    }
    if (this.sound) {
      this.sound.stop();
    }
    this.destroy();
  }

  update() { }

  setInitialVelocity(x) {
    this.body.velocity.x = Phaser.Math.Between(-x, x);
    this.body.velocity.y = Phaser.Math.Between(-x, x);
  }

  suffer() {
    this.suffering = true;
    this.setTintFill(0xffffff);
    setTimeout(() => {
      this.clearTint();
      this.suffering = false;
    }, 200);
  }
}
