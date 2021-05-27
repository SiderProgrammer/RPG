import SCENES from "../constants/scenes";
import Button from "../game_objects/Button";

export default class PopUpWindow extends Phaser.Scene {
  constructor() {
    super(SCENES.POP_UP_WINDOW);
    this.isDialogueOpened = false;
  }

  showDialogueWindow(dialogueConfig, avatarTexture, closeDialogueCallback) {
    if (this.isDialogueOpened) return;

    this.elements = [];

    this.closeDialogueCallback = closeDialogueCallback;
    this.dialogueConfig = dialogueConfig;
    this.isDialogueOpened = true;

    const staticElements = this.createStaticElements();

    const avatar = this.add.image(
      staticElements[1].x,
      staticElements[1].y,
      avatarTexture
    );

    const message = Object.values(dialogueConfig)[0].say; // first message
    this.message = this.createMessage(message);

    const anwsersConfig = Object.values(dialogueConfig)[0].answers; // buttons inscription
    this.anwserButtons = this.createEmptyAnwserButtons();
    this.updateAnwserButtons(anwsersConfig);

    this.elements.push(
      ...staticElements,
      avatar,
      ...this.anwserButtons,
      ...this.getAnwserButtonsInscriptions(),
      this.createCloseButton(),
      this.message
    );

    this.elements.forEach((el) => el.setDepth(el.depth + 100));
  }

  createEmptyAnwserButtons() {
    const buttons = [];

    for (let i = 0; i < 2; i++) {
      buttons[i] = this.createDialogButton(
        this.frame.x,
        this.frame.y + this.frame.displayHeight / 2 - 120
      );
    }
    return buttons;
  }

  createAnwserButtons(anwsersConfig) {
    return anwsersConfig.map((config) => {
      return this.createDialogButton(
        this.frame.x,
        this.frame.y + this.frame.displayHeight / 2 - 120,
        config.reply,
        config.linkTo
      ).updateWidth();
    });
  }

  createDialogButton(x, y) {
    const self = this;

    const callback = function () {
      if (!self.dialogueConfig[this.linkingTo]) {
        self.closeDialogueWindow();
        self.closeDialogueCallback();
        return;
      }

      self.updateDialogue(self.dialogueConfig[this.linkingTo]);
    };

    const button = new Button(
      this,
      x,
      y,
      "DialogButton",
      callback,
      "" // text on button
    );

    button.updateWidth = function () {
      this.displayWidth = this.text.displayWidth + 50;
      return this;
    };

    button.updateTextPos = function () {
      this.text.setPosition(this.x, this.y);
      return this;
    };

    button.update = function (config) {
      if (!config) {
        this.isActive = false;
        return this;
      }

      this.isActive = true;
      this.linkingTo = config.linkTo;
      this.text.setText(config.reply);
      this.updateWidth();
      return this;
    };

    button.show = function () {
      this.setVisible(true);
      this.text.setVisible(true);
    };

    button.hide = function () {
      this.setVisible(false);
      this.text.setVisible(false);
    };

    return button;
  }

  updateAnwserButtons(anwsersConfig) {
    this.anwserButtons.forEach((b, i) => b.update(anwsersConfig[i]));

    let activeButtons = 2;
    this.anwserButtons.forEach((b) => {
      if (!b.isActive) {
        b.hide();
        activeButtons--;
      } else {
        b.show();
      }
    });

    this.updateAnwserButtonsPosition(activeButtons);
  }

  updateDialogue(config) {
    this.message.setText(config.say);
    this.updateAnwserButtons(config.answers);
  }

  getAnwserButtonsInscriptions() {
    return this.anwserButtons.map((b) => b.text);
  }

  createStaticElements() {
    this.frame = this.add
      .image(
        this.cameras.main.midPoint.x,
        this.cameras.main.midPoint.y,
        "DialogueFrame"
      )
      .setDepth(-1);

    const avatarFrame = this.add.image(
      this.frame.x - this.frame.displayWidth / 2 + 50,
      this.frame.y - this.frame.displayHeight / 2 + 70,
      "Dialog_AvatarFrame"
    );

    const blackSquare = this.add
      .image(avatarFrame.x, avatarFrame.y, "black_square")
      .setDepth(-1);

    blackSquare.displayWidth = avatarFrame.displayWidth / 1.6;
    blackSquare.displayHeight = avatarFrame.displayHeight / 1.6;

    return [this.frame, avatarFrame, blackSquare];
  }

  createCloseButton() {
    return new Button(
      this,
      this.frame.x + this.frame.displayWidth / 2 - 30,
      this.frame.y - this.frame.displayHeight / 2 + 50,
      "DialogClose",
      () => {
        this.closeDialogueWindow();
        this.closeDialogueCallback(); // for some reason it is not working properly
      }
    );
  }

  createMessage(message) {
    return this.add
      .text(
        this.frame.x - this.frame.displayWidth / 2 + 50,
        this.frame.y - this.frame.displayHeight / 2 + 170,
        message,
        { font: "40px Arial" }
      )
      .setWordWrapWidth(this.frame.displayWidth - 100);
  }

  closeDialogueWindow() {
    this.elements.forEach((el) => el.destroy());
    this.isDialogueOpened = false;
  }

  updateAnwserButtonsPosition(activeButtons) {
    const EDGE_SHIFT = 100;

    if (activeButtons > 1) {
      this.anwserButtons[0].x =
        this.frame.x -
        this.frame.displayWidth / 2 +
        this.anwserButtons[0].displayWidth / 2 +
        EDGE_SHIFT;

      this.anwserButtons[1].x =
        this.frame.x +
        this.frame.displayWidth / 2 -
        this.anwserButtons[1].displayWidth / 2 -
        EDGE_SHIFT;
    } else {
      this.anwserButtons[0].x = this.frame.x;
    }

    this.anwserButtons.forEach((b) => b.updateTextPos());
  }
}
