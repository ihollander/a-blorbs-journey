import SpreadNailGun from "./SpreadNailGun";
import SideToothGun from "./SideToothGun";
import EyeballGun from "./EyeballGun";

export default class ToothAndNailGun {
  constructor(scene) {
    this.spreadNailGun = new SpreadNailGun(scene);
    this.toothGun = new SideToothGun(scene);
    this.eyeballGun = new EyeballGun(scene);
  }

  fire(x, y, angle, scale) {
    this.spreadNailGun.fire(x, y, angle, scale);
    this.toothGun.fire(x, y, angle, scale);
    this.eyeballGun.fire(x, y, angle + 180, scale);
  }
}
