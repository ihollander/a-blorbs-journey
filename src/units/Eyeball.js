import { EYEBALL_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class Eyeball extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, EYEBALL_IMAGE, "Eyeball");

    this.setScale(0.5, 0.5);

    Math.random() > 0.5 ? (this.spin = "l") : (this.spin = "r");

    this.collisionDamage = 30;
  }

  update() {
    this.spin === "l" ? (this.angle += 10) : (this.angle -= 10);
  }
}
