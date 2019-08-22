import { EYEBALL_CLUSTER_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class EyeballCluster extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, EYEBALL_CLUSTER_IMAGE, "EyeballCluster");

    this.setScale(0.5, 0.5);
    this.body.maxVelocity.x = 50;
    this.body.maxVelocity.y = 50;

    this.spin = Math.random > 0.5 ? "l" : "r";

    this.health = 30;

    this.collisionDamage = 50;
  }

  update() {
    this.spin === "l" ? (this.angle += 0.1) : (this.angle -= 0.1);
  }
}
