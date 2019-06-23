import Ammo from "./Ammo";

import { NAIL_IMAGE } from "../consts/images";
import { SPIT1_SOUND } from "../consts/sounds";

export default class Nail extends Ammo {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.setTexture(NAIL_IMAGE);

    this.speed = 800;

    // default damage
    this.damage = 0.5;
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

    // play launch sound
    this.scene.sound.play(SPIT1_SOUND, {
      seek: 0.15
    });
  }
}
