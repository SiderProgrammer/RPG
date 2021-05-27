import SCENES from "../constants/scenes";
import Button from "../game_objects/Button";

export default class HUD extends Phaser.Scene {
  constructor() {
    super(SCENES.HUD);

    this.edgeDistance = 20;
    this.URL = "https://growmindgrow.com/parent/games/list";
  }
  create() {
    this.GW = this.cameras.main.displayWidth; //this.game.renderer.width
    this.GH = this.cameras.main.displayHeight; //this.game.renderer.height
    this.createCharacterWidget();
    this.createManaWidget();
  }

  createCharacterWidget() {
    [
      "characterWidgetGlow",
      "characterWidgetFrame",
      "characterWidget",
      "characterWidgetRing"
    ].map((img) => {
      this.add
        .image(this.edgeDistance - 20, this.GH - this.edgeDistance - 15, img)
        .setOrigin(0, 1)
        .setScale(0.8);
    });
  }

  createManaWidget() {
    [
      "manaWidgetGlowDouble",
      "manaWidgetGlow",
      "manaWidgetFill",
      "manaWidgetBubble",

      "manaWidgetBrain",
      "manaWidgetFrame"
    ].map((img) => {
      this.add
        .image(
          this.GW - this.edgeDistance + 25,
          this.GH - this.edgeDistance - 5,
          img
        )
        .setOrigin(1, 1)
        .setScale(0.6);
    });

    const manaButton = new Button(
      this,
      this.GW - this.edgeDistance + 25,
      this.GH - this.edgeDistance - 5,
      "manaWidgetFrame",
      () => {
        const radius = manaButton.displayWidth / 3;
        const x = this.input.x - manaButton.x + manaButton.displayWidth / 2;
        const y = this.input.y - manaButton.y + manaButton.displayHeight / 2;
        if (radius > Math.sqrt(x * x + y * y)) {
          window.open(this.URL, "_blank");
        }
      }
    )
      .setOrigin(1, 1)
      .setScale(0.6)
      .setAlpha(0.1);
  }
}
