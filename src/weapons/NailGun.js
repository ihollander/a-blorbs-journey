import Nail from "../bullets/Nail";
import { SPIT2_SOUND } from "../consts/sounds";

export default class NailGun {
  constructor(scene) {
    this.interval = 200;
    this.nextFire = 0;
    this.scene = scene;
  }

  fire(x, y, rotation, scale) {
    if (this.scene.time.now < this.nextFire) return;

    this.nextFire = this.scene.time.now + this.interval;

    for (let i = -1; i <= 1; i += 2) {
      const offsetX = i * 10;
      const offsetY = i * 10;
      const bullet = new Nail(this.scene, x + offsetX, y + offsetY);
      this.scene.bulletGroup.add(bullet);
      bullet.init(rotation, scale);
    }

    // play launch sound
    this.scene.sound.play(SPIT2_SOUND, {
      seek: 0.65
    });
  }
}
