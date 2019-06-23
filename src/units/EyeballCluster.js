import { EYEBALL_CLUSTER_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class EyeballCluster extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, EYEBALL_CLUSTER_IMAGE, "EyeballCluster");

    this.setScale(0.5, 0.5);
    this.body.maxVelocity.x = 50;
    this.body.maxVelocity.y = 50;

    Math.random > 0.5 ? (this.spin = "l") : (this.spin = "r");

    this.health = 3;
  }

  damage(x) {
    if (this.suffering === false) {
      this.health -= x;

      if (this.health <= 0) {
        // Spawn a random number of eyeballs
        this.scene.spawnEyeballs(
          Math.floor(Math.random() * 5) + 2,
          this.x,
          this.y
        );
        // And then destroy
        this.destroy();
      } else {
        this.suffer();
      }
    }
  }

  update() {
    this.spin === "l" ? (this.angle += 0.1) : (this.angle -= 0.1);
  }
}
