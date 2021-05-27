import HealthBar from "./HealthBar";
import battleConfig from "../../configuration/battle";
import "regenerator-runtime/runtime";
export default class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, name) {
    super(scene, x, y, texture);
    this.scene.add.existing(this);

    this.name = name;

    this.setInteractive();
    this.createHealthBar();
    this.createName();
  }
  createName() {
    this.nameText = this.scene.add
      .text(this.x, this.y + 130, this.name, { font: "30px Arial" })
      .setOrigin(0.5)
      .setDepth(6);
  }

  showAttackAnimation(x, y, flipX = true) {
    return new Promise((resolve) => {
      const attackImage = this.scene.add
        .sprite(x, y, "attack")
        .setFlipX(flipX)
        .setDepth(10);
      attackImage.play("attack");
      attackImage.once("animationcomplete", resolve);
    });
  }

  createHealthBar() {
    this.healthBar = new HealthBar(
      this.scene,
      this.x,
      this.y + 70,
      "Health_Bar"
    );
    this.healthBar.move(-this.healthBar.getWidth() / 2);
  }

  kill() {
    this.isDied = true;
    this.setVisible(false);
    this.nameText.setVisible(false);
    this.healthBar.setVisible(false);
  }

  handleTheAttack(damage) {
    if (this.hasMissedAttack(battleConfig.missLikelihood)) {
      //  await new Promise((resolve) => {
      let sign = "-";

      if (this.type !== "enemy") {
        sign = "+";
      }

      this.scene.tweens.add({
        targets: this,
        x: `${sign}=50`,
        y: `+=50`,
        yoyo: true,
        duration: 500
        //  onComplete: resolve
      });
      //   });

      return;
    }

    this.scene.tweens.add({
      targets: this,
      x: "-=20",
      yoyo: true,
      repeat: 5,
      duration: 50
    });

    this.damage(damage);

    if (this.healthBar.value <= 0) {
      this.kill();
    }
  }

  damage(damage) {
    this.healthBar.decrease(damage);

    const damageText = this.scene.add
      .text(this.x, this.y, damage, { font: "40px Arial" })
      .setScale(0.2)
      .setOrigin(0.5)
      .setDepth(10);

    this.scene.tweens.add({
      targets: damageText,
      scale: 1,
      y: "-=50",
      duration: 500,
      onComplete: () => damageText.destroy()
    });
  }

  heal(healValue) {
    this.healthBar.increase(healValue * 100);

    const healText = this.scene.add
      .text(this.x, this.y, `Health + ${healValue * 100}%`, {
        font: "40px Arial",
        color: "#00FF00"
      })
      .setScale(0.2)
      .setOrigin(0.5)
      .setDepth(10);

    this.scene.tweens.add({
      targets: healText,
      scale: 1,
      y: "-=50",
      duration: 1000,
      onComplete: () => healText.destroy()
    });
  }

  hasMissedAttack(chance) {
    return Math.random() < chance;
  }
}
