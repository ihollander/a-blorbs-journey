import { EYEBALL_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class EyeballCluster extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, EYEBALL_IMAGE, "EyeballCluster");

    this.setScale(0.6, 0.6);
    this.body.maxVelocity.x = 50;
    this.body.maxVelocity.y = 50;

    this.health = 3;
  }

  damage(x) {
    if (this.suffering === false) {
      this.health -= x;

      if (this.health <= 0) {
        this.scene.spawnEyeballs(4, this.x, this.y);
        this.destroy();
      } else {
        this.suffer();
      }
    }
  }
}
