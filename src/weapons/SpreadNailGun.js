import Nail from "../bullets/Nail";
import { SPIT1_SOUND } from "../consts/sounds";

export default class NailGun {
  constructor(scene) {
    this.interval = 200;
    this.nextFire = 0;
    this.scene = scene;
  }

  fire(x, y, angle, scale) {
    if (this.scene.time.now < this.nextFire) return;

    this.nextFire = this.scene.time.now + this.interval;

    for (let i = 1; i <= 3; i++) {
      const offsetAngle = (i - 2) * 15;
      const bullet = new Nail(this.scene, x, y);
      this.scene.bulletGroup.add(bullet);
      bullet.init(angle + offsetAngle, scale);
    }

    // play launch sound
    this.scene.sound.play(SPIT1_SOUND, {
      seek: 0.65
    });
  }
}
