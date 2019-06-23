import { CHASER_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class Chaser extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, CHASER_IMAGE, "Chaser");

    this.setScale(0.4, 0.4);
  }

  update() {
    debugger;
  }
}
