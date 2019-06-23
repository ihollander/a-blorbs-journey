import { CLAWBER_FULL_IMAGE } from "../consts/images";
import { CLAWBER_HALF_IMAGE } from "../consts/images";
import { CLAWBER_EMPTY_IMAGE } from "../consts/images";

import ClawberShot from "../weapons/ClawberShot";

import Enemy from "./Enemy";

export default class Chaser extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, CLAWBER_FULL_IMAGE, "Chaser");

    this.weapon = new ClawberShot(this.scene);

    this.setScale(0.4, 0.4);

    this.health = 20;

    this.claws = 2;

    this.collisionDamage = 10;
  }

  update() {
    // Find the angle between clawber and player
    const angle = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );

    // Look at player if aggressive, otherwise look away
    if (this.claws > 0) {
      this.setAngle((angle * 180) / Math.PI);
    } else {
      this.setAngle((angle * 180) / Math.PI + 180);
    }

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );

    if (distance > 250 && this.claws > 1) {
      this.scene.physics.velocityFromRotation(
        this.rotation,
        300,
        this.body.velocity
      );
    } else if (distance <= 250 && this.claws > 1) {
      this.fire();
    } else if (distance <= 450 && this.claws > 0) {
      this.scene.physics.velocityFromRotation(
        this.rotation,
        -100,
        this.body.velocity
      );
    } else if (distance > 500 && this.claws > 0) {
      this.fire();
    } else {
      this.scene.physics.velocityFromRotation(
        this.rotation,
        350,
        this.body.velocity
      );
    }
  } // end update

  fire() {
    this.claws--;
    this.claws === 1
      ? this.setTexture(CLAWBER_HALF_IMAGE)
      : this.setTexture(CLAWBER_EMPTY_IMAGE);
    const isLarge = this.claws > 0 ? false : true;
    this.weapon.fire(this.x, this.y, this.body.rotation + 70, isLarge);
  }
}
