import Ammo from "./Ammo";

import { NAIL_IMAGE } from "../consts/images";
import { SPIT1_SOUND } from "../consts/sounds";

export default class Nail extends Ammo {
  constructor(scene, x, y) {
    x += Phaser.Math.Between(-15, 15);
    y += Phaser.Math.Between(-15, 15);
    super(scene, x, y, NAIL_IMAGE);

    this.speed = 800;

    // default damage
    this.damage = 15;

    this.lifespan = 50;
  }

  init(angle, scale) {
    // set movement physics
    this.setScale(scale);
    this.setAngle(angle);

    this.scene.physics.velocityFromRotation(
      this.rotation,
      this.speed,
      this.body.velocity
    );

    this.body.velocity.x *= 2;
    this.body.velocity.y *= 2;
  }
}
