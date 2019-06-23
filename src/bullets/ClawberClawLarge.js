import Ammo from "./Ammo";

import {
  CLAWBER_CLAW_BIG_IMAGE,
  CLAWBER_CLAW_SMALL_IMAGE
} from "../consts/images";

import { SPIT1_SOUND } from "../consts/sounds";

export default class ClawberClaw extends Ammo {
  constructor(scene, x, y, rotation, isLarge) {
    x += Phaser.Math.Between(-15, 15);
    y += Phaser.Math.Between(-15, 15);
    super(scene, x, y);

    this.speed = 450;

    // default damage
    this.damage = 60;
    this.setTexture(CLAWBER_CLAW_BIG_IMAGE);
  }

  init(rotation, isLarge) {
    this.setScale(0.375);
    this.setAngle(rotation - 67.5);

    this.scene.physics.velocityFromRotation(
      this.rotation,
      700,
      this.body.velocity
    );

    this.body.velocity.x *= 2;
    this.body.velocity.y *= 2;
  }
}
