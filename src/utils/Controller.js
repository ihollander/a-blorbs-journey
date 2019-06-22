export default class Controller {
  constructor(scene) {
    this.scene = scene;

    // Track the arrow keys for movement
    this.cursors = scene.input.keyboard.createCursorKeys();

    // Track the WASD keys for firing direction
    const { W, A, S, D } = Phaser.Input.Keyboard.KeyCodes;
    this.wasds = {
      up: scene.input.keyboard.addKey(W),
      left: scene.input.keyboard.addKey(A),
      down: scene.input.keyboard.addKey(S),
      right: scene.input.keyboard.addKey(D)
    };

    this.pad = null;
  }

  // must call update to get info from gamepad
  update() {
    if (this.scene.input.gamepad.total) {
      this.pad =
        this.scene.input.gamepad.getPad(0) || this.scene.input.gamepad.pad1;
    }
  }

  get moveUp() {
    return (
      this.wasds.up.isDown ||
      (this.pad &&
        this.pad.axes[1].value < -this.pad.axes[1].threshold &&
        this.pad.axes[1].value < -0.5)
    );
  }

  get moveDown() {
    return (
      this.wasds.down.isDown ||
      (this.pad &&
        this.pad.axes[1].value > this.pad.axes[1].threshold &&
        this.pad.axes[1].value > 0.5)
    );
  }

  get moveLeft() {
    return (
      this.wasds.left.isDown ||
      (this.pad &&
        this.pad.axes[0].value < -this.pad.axes[0].threshold &&
        this.pad.axes[0].value < -0.5)
    );
  }

  get moveRight() {
    return (
      this.wasds.right.isDown ||
      (this.pad &&
        this.pad.axes[0].value > this.pad.axes[0].threshold &&
        this.pad.axes[0].value > -0.5)
    );
  }

  get shootUp() {
    return (
      this.cursors.up.isDown ||
      (this.pad &&
        this.pad.axes[4].value < -this.pad.axes[4].threshold &&
        this.pad.axes[4].value < -0.5)
    );
  }

  get shootDown() {
    return (
      this.cursors.down.isDown ||
      (this.pad &&
        this.pad.axes[4].value > this.pad.axes[4].threshold &&
        this.pad.axes[4].value > 0.5)
    );
  }

  get shootRight() {
    return (
      this.cursors.right.isDown ||
      (this.pad &&
        this.pad.axes[3].value > this.pad.axes[3].threshold &&
        this.pad.axes[3].value > 0.5)
    );
  }

  get shootLeft() {
    return (
      this.cursors.left.isDown ||
      (this.pad &&
        this.pad.axes[3].value < -this.pad.axes[3].threshold &&
        this.pad.axes[3].value < -0.5)
    );
  }
}
