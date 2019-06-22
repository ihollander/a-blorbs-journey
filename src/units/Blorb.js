import { PLAYER1_IMAGE } from "../consts/images";

import Enemy from "./Enemy";

export default class Blorb extends Enemy {
  constructor(scene, x, y) {
    super(scene, x, y, PLAYER1_IMAGE, "Blorb");
    this.setScale(0.15, 0.15);
    this.body.velocity.y = Phaser.Math.Between(10, 100);
    this.body.velocity.x = Phaser.Math.Between(-100, 100);
  }
}
