export default class Button {
  constructor(scene, x, y, sprite, func, text) {
    const button = this.createButton(scene, x, y, sprite, func, text);
    button.text = this.createText(scene, button.x, button.y, text);

    return button;
  }

  createButton(scene, x, y, sprite, func) {
    const button = scene.add.image(x, y, sprite);
    button.setInteractive();
    button.on("pointerdown", func);

    return button;
  }

  createText(scene, x, y, text) {
    return scene.add
      .text(x, y, text, {
        font: "40px Arial"
      })
      .setOrigin(0.5);
  }
}
