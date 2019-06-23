import Ammo from "./Ammo";

import { EYEBALL_IMAGE } from "../consts/images";

export default class Eyeball extends Ammo {
  constructor(scene, x, y) {
    super(scene, x, y, EYEBALL_IMAGE);

    // damage
    this.damage = 30;

    // speed
    this.speed = 200;
  }

  init(angle, scale) {
    // set movement physics
    this.setScale(scale * 1.5);
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
