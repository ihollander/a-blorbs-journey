import { TOOTH_IMAGE } from "../consts/images";

export default class Bullet {
  constructor({ scene, group, x, y, angle }) {
    this.sprite = group
      .create(x, y, TOOTH_IMAGE)
      .setScale(0.25, 0.25)
      .setAngle(angle);

    // timer to destroy bullet
    this.lifespan = 100;

    // movement logic
    this.speed = 1000;
  }

  get active() {
    return this.lifespan > 0;
  }

  update() {
    this.lifespan--;

    if (this.sprite.active && this.lifespan <= 0) {
      // this.sprite.setActive(false);
      // this.sprite.setVisible(false);
      this.sprite.disableBody(true, true);
      this.sprite.destroy(); // ??
    }
  }
}
