import SpreadNailGun from "./SpreadNailGun";
import ToothGun from "./ToothGun";

export default class ToothAndNailGun {
  constructor(scene) {
    this.spreadNailGun = new SpreadNailGun(scene);
    this.toothGun = new ToothGun(scene);
  }

  fire(x, y, angle, scale) {
    this.spreadNailGun.fire(x, y, angle, scale);
    this.toothGun.fire(x, y, angle - 180, scale);
  }
}
