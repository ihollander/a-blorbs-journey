import Bullet from "./Bullet";

import { TOOTH_IMAGE } from "../consts/images";

export default class Tooth extends Bullet {
  constructor({ scene, group, x, y, angle }) {
    super({ scene, group, x, y, angle });

    this.sprite.setTexture(TOOTH_IMAGE).setAngularVelocity(500);

    // timer to destroy bullet
    this.lifespan = 100;

    // movement logic
    this.speed = 400;
    scene.physics.velocityFromRotation(
      this.sprite.rotation,
      this.speed,
      this.sprite.body.velocity
    );

    this.sprite.body.velocity.x *= 2;
    this.sprite.body.velocity.y *= 2;
  }
}
