import { EYEBALL_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class EyeballCluster extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, EYEBALL_IMAGE, "EyeballCluster");

    this.setScale(0.35, 0.35);

    this.health = 4;
    this.suffering = false;
  }

  damage(x) {
    this.health -= x;

    if (this.health <= 0) {
      this.scene.spawnEyeballs(4);
      this.destroy();
    } else {
      this.suffer();
    }
  }

  suffer() {
    this.suffering = true;
    this.setTintFill(0xffffff);
    setTimeout(() => {
      this.clearTint();
      this.suffering = false;
    }, 200);
  }
}
