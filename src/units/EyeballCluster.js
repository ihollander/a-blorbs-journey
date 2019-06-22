import { EYEBALL_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class EyeballCluster extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, EYEBALL_IMAGE, "EyeballCluster");

    this.setScale(0.35, 0.35);

    this.health = 2;
  }

  damage(x) {
    console.log(`EyeballCluster: ${x} health, x: ${this.x}, y: ${this.y}`);
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
