export default class HealthBar {
  constructor(scene, x, y, frameTexture) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.bar.frame = scene.add
      .image(x, y, frameTexture)
      .setDepth(13)
      .setOrigin(0);

    this.bar.setDepth(10);
    this.x = x;
    this.y = y;
    this.value = 100;
    this.p = (this.bar.frame.displayWidth - 65) / 100;

    this.draw();

    scene.add.existing(this.bar);
  }

  move(x, y) {
    this.bar.x += x;
    this.bar.frame.x += x;
  }
  getWidth() {
    return this.bar.frame.displayWidth;
  }

  decrease(amount) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return this.value === 0;
  }

  increase(amount) {
    this.value += amount;

    if (this.value > 100) {
      this.value = 100;
    }

    this.draw();
  }

  setVisible(visibility) {
    this.bar.setVisible(visibility);
    this.bar.frame.setVisible(visibility);
  }

  draw() {
    this.bar.clear();

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(
      this.x + 32.5,
      this.y + 10,
      this.bar.frame.displayWidth - 65,
      this.bar.frame.displayHeight - 15
    );

    if (this.value < 30) {
      this.bar.fillStyle(0xff0000);
    } else {
      this.bar.fillStyle(0x00ff00);
    }

    var d = Math.floor(this.p * this.value);

    this.bar.fillRect(
      this.x + 32.5,
      this.y + 10,
      d,
      this.bar.frame.displayHeight - 15
    );
  }
}
