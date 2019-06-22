import { EYEBALL_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class EyeballCluster extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, EYEBALL_IMAGE, "Eyeball");

    this.setScale(0.35, 0.35);
  }
}
