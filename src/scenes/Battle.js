import SCENES from "../constants/scenes";
import Player from "../helpers/battle/Player";
import Enemy from "../helpers/battle/Enemy";
import Button from "../game_objects/Button";
import OutlinePlugin from "../helpers/OutlinePlugin";
import "regenerator-runtime/runtime";
export default class Battle extends Phaser.Scene {
  constructor() {
    super(SCENES.BATTLE);
  }

  init(data) {
    this.playerTexture = data.player.texture.key;
    this.enemyTexture = data.enemy.texture.key;
    this.currentMapScene = data.currentMapScene; // scene context from which the battle is started from

    this.areActionButtonsDisabled = true;
    this.canChooseEnemyToAttack = false;
    this.turnIterator = 0;
    this.actionButtons = [];
    this.entities = [];
    this.enemies = [];
  }
  async create() {
    this.outlinePlugin = new OutlinePlugin(this);

    this.GW = this.cameras.main.displayWidth;
    this.GH = this.cameras.main.displayHeight;

    await this.showBattleScreenIntro(4000);

    this.background = this.createBackground();
    this.createPlayer();
    this.createEnemies();
    this.enemies = this.entities.filter((entity) => entity.type === "enemy");

    this.actionInfoText = this.add
      .text(this.GW / 2, 150, "", { font: "40px Arial" })
      .setDepth(5)
      .setOrigin(0.5);

    // this.resultInfoText = this.add
    // .text(this.GW / 2, 350, "", { font: "40px Arial" })
    // .setDepth(5)
    // .setOrigin(0.5);

    this.createActionBar();
    this.nextTurn();
  }

  update() {
    this.moveBackground();
  }

  highlightActionButton(button) {
    button.setScale(1.2);
  }

  removeActionButtonHighlight(button) {
    button.setScale(1);
  }
  removeActionButtonsHighlights() {
    this.actionButtons.forEach((b) => this.removeActionButtonHighlight(b));
  }

  async nextTurn() {
    if (this.turnIterator > this.entities.length - 1) this.turnIterator = 0;
    const entity = this.entities[this.turnIterator];

    this.turnIterator++;

    if (entity.isDied) {
      if (this.player.isDied) this.endBattle();
      this.nextTurn();
      return;
    }
    this.removeActionButtonsHighlights();
    this.informWhomTurn(entity.name);
    this.updateAvatarInFrame(entity.texture.key);

    if (entity.type === "player") {
      this.enableActionButtons();
    } else if (entity.type === "enemy") {
      entity.highlight();
      entity.takeAction();
    }
  }
  updateAvatarInFrame(texture) {
    this.avatarInFrame.setTexture(texture);
  }
  actionButtonClicked() {
    this.removeActionButtonHighlight(this.attackButton);
    this.disableActionButtons();
    this.nextTurn();
  }
  informWhomTurn(name) {
    this.whomTurnText.setText(name + "'s turn");
  }
  disableActionButtons() {
    this.areActionButtonsDisabled = true;
  }

  enableActionButtons() {
    this.areActionButtonsDisabled = false;
  }

  getEnemyPartyTotalHealth() {
    return (
      this.enemies.reduce((acc, entity) => {
        return acc + entity.healthBar.value;
      }, 0) / this.enemies.length
    );
  }
  isVictory() {
    return this.getEnemyPartyTotalHealth() === 0;
  }

  updateActionInfo({ name, action, target }) {
    this.actionInfoText.setText(`${name} ${action} ${target}`);
  }

  // updateResultInfo({ name, action, target }) {
  //   this.resultInfoText.setText(`${name} ${action} ${target}`);
  // }

  async handleEntityFocus(entity) {
    if (this.canChooseEnemyToAttack && entity.type === "enemy") {
      entity.handleTheAttack(this.player.damageValue);
      this.canChooseEnemyToAttack = false;

      this.updateActionInfo({
        name: this.player.name,
        action: "attacks",
        target: "enemy"
      });

      this.disableActionButtons();

      await this.player.showAttackAnimation(
        this.player.x - 180,
        this.player.y - 50
      );
      if (this.isVictory()) {
        await this.showBattleScreenVictory(3000);
        this.endBattle();
      }

      this.actionButtonClicked();
    }
  }

  createEnemy(x, y, texture, name) {
    const entity = new Enemy(this, x, y, texture, name);
    entity.on("pointerup", () => this.handleEntityFocus(entity));
    this.entities.push(entity);

    return entity;
  }

  endBattle() {
    this.scene.stop();
    this.currentMapScene.leaveBattle();
  }
  createPlayer() {
    this.player = new Player(
      this,
      this.GW - 150,
      this.GH / 2,
      this.playerTexture,
      "Player"
    ).setDepth(5);

    this.entities.push(this.player);
  }

  createEnemies() {
    this.createEnemy(120, this.GH / 2 - 80, this.enemyTexture, "Sample enemy")
      .setDepth(5)
      .setFlipX(true)
      .play("Sten0001_Rookie_idle");
    this.createEnemy(350, this.GH / 2, this.enemyTexture, "Sample enemy")
      .setDepth(5)
      .setFlipX(true)
      .play("Sten0001_Rookie_idle");

    // this.createEnemy(180, this.GH / 2 + 90, this.enemyTexture, "Sample enemy")
    //   .setDepth(5)
    //   .setFlipX(true)
    //   .play("Sten0001_Rookie_idle");
  }
  createBackground() {
    const layer_1 = this.add
      .tileSprite(this.GW / 2, 0, this.GW, 0, "Layer01") // upper layer
      .setOrigin(0.5, 0)
      .setDepth(1);
    const layer_2 = this.add
      .tileSprite(this.GW / 2, 0, this.GW, 0, "Layer02")
      .setOrigin(0.5, 0)
      .setDepth(2);
    const layer_3 = this.add
      .tileSprite(this.GW / 2, this.GH, this.GW, 0, "Layer03") // down layer
      .setOrigin(0.5, 0)
      .setDepth(3);

    layer_3.y -= layer_3.displayHeight;
    console.log(layer_1);
    return {
      layer_1,
      layer_2,
      layer_3
    };
  }

  moveBackground() {
    if (!this.background) return;

    // messy code just for testing
    const speed = 0.1;
    this.background.layer_1.tilePositionX +=
      this.background.layer_1.speed || -speed;

    this.background.layer_3.tilePositionX +=
      this.background.layer_3.speed || speed;

    if (
      this.background.layer_1.tilePositionX >
      (this.background.layer_1.width - this.GW) / 2
    ) {
      this.background.layer_1.speed = -speed;
    }
    if (
      this.background.layer_1.tilePositionX <
      -(this.background.layer_1.width - this.GW) / 2
    ) {
      this.background.layer_1.speed = speed;
    }

    if (
      this.background.layer_3.tilePositionX >
      (this.background.layer_3.width - this.GW) / 2
    ) {
      this.background.layer_3.speed = -speed;
    }
    if (
      this.background.layer_3.tilePositionX <
      -(this.background.layer_3.width - this.GW) / 2
    ) {
      this.background.layer_3.speed = speed;
    }
  }

  createWhomTurnText() {
    this.whomTurnText = this.add
      .text(this.GW / 2, this.GH - 300, "", {
        font: "40px Arial"
      })
      .setDepth(4)
      .setOrigin(0.5);
  }

  createActionButtons() {
    this.healButton = new Button(
      this,
      this.GW / 2,
      this.GH - 150,
      "Action_Heal",
      () => {
        if (this.areActionButtonsDisabled) return;
        this.actionButtonClicked();
        this.player.heal(0.2);
      }
    ).setDepth(4);

    this.runButton = new Button(
      this,
      this.GW / 2 + 200,
      this.GH - 150,
      "Action_Run",
      async () => {
        if (this.areActionButtonsDisabled) return;
        this.actionButtonClicked();
        await this.showBattleScreenEscape(3500);
        this.endBattle();
      }
    ).setDepth(4);

    this.attackButton = new Button(
      this,
      this.GW / 2 - 200,
      this.GH - 150,
      "Action_Attack",
      () => {
        if (this.areActionButtonsDisabled) return;
        this.canChooseEnemyToAttack = true;
        this.highlightActionButton(this.attackButton);
      }
    ).setDepth(4);

    this.actionButtons = [this.healButton, this.runButton, this.attackButton];
  }

  createAvatarSet() {
    this.avatarFrame = this.add
      .image(this.GW / 2 - 430, this.GH - 150, "Avatar_Frame")
      .setDepth(4);

    const blackSquare = this.add
      .image(this.avatarFrame.x, this.avatarFrame.y, "black_square")
      .setDepth(3);

    blackSquare.displayWidth = this.avatarFrame.displayWidth / 1.6;
    blackSquare.displayHeight = this.avatarFrame.displayHeight / 1.6;

    this.avatarInFrame = this.add
      .image(this.avatarFrame.x, this.avatarFrame.y, this.playerTexture)
      .setDepth(5);
  }

  createActionBar() {
    this.createWhomTurnText();
    this.createActionButtons();
    this.createAvatarSet();
  }

  showBattleScreenVictory(duration) {
    const elements = {
      bg: this.createBattleScreenBG().setDepth(14),
      victory: this.add.image(this.GW / 2, 0, "Text_Victory").setDepth(15),
      image: this.add
        .image(this.GW / 2, this.GH / 2 + 100, "Emblem")
        .setDepth(15)
        .setScale(0.1)
        .setAngle(0)
    };
    elements.victory.y -= elements.victory.displayHeight / 2;

    const ease = "Bounce.easeOut";
    this.tweens.add({
      targets: elements.image,
      angle: 360,
      scale: 0.7,
      duration: 500,
      onComplete: () => {
        this.tweens.add({
          targets: elements.victory,
          y: this.GH / 2,
          duration: 450,
          ease: "Quad",
          onComplete: () => {
            this.tweens.add({
              targets: elements.victory,
              y: this.GH / 2 - 150,
              duration: 700,
              ease
            });
          }
        });
      }
    });
    return new Promise((resolve) =>
      this.handleBattleScreenFinish(resolve, elements, duration)
    );
  }

  showBattleScreenEscape(duration) {
    const elements = {
      bg: this.createBattleScreenBG().setDepth(14),
      arrow: this.add.image(150, this.GH / 2, "Escape_Arrow").setDepth(15),
      you: this.add.image(this.GW / 2, 0, "Escaped_1").setDepth(15),
      escaped: this.add.image(this.GW / 2, this.GH, "Escaped_2").setDepth(15)
    };
    elements.you.y -= elements.you.displayHeight / 2;
    elements.escaped.y += elements.escaped.displayHeight / 2;

    this.tweens.add({
      targets: elements.arrow,
      duration: 500,
      x: this.GW - 200
    });
    this.time.addEvent({
      callback: () => {
        this.animateSubtitles({
          upperText: elements.you,
          bottomText: elements.escaped,
          bounceOffset: 100,
          settleOffset: 370
        });
      },
      delay: 500
    });

    return new Promise((resolve) => {
      this.input.once("pointerdown", () => {
        this.handleBattleScreenFinish(resolve, elements, duration);
      });
    });
  }

  animateSubtitles({ upperText, bottomText, bounceOffset, settleOffset }) {
    const ease = "Bounce.easeOut";

    this.tweens.add({
      targets: bottomText,
      y: this.GH / 2 + bounceOffset,
      duration: 450,
      ease: "Quad"
    });
    this.tweens.add({
      targets: upperText,
      y: this.GH / 2 - bounceOffset,
      duration: 450,
      ease: "Quad",
      onComplete: () => {
        this.tweens.add({
          targets: upperText,
          y: settleOffset,
          duration: 700,
          ease
        });

        this.tweens.add({
          targets: bottomText,
          y: this.GH - settleOffset,
          duration: 700,
          ease
        });
      }
    });
  }
  createBattleScreenBG() {
    return this.add
      .image(this.GW / 2, this.GH / 2, "1097")
      .setDisplaySize(this.GW, this.GH);
  }
  handleBattleScreenFinish(resolve, elements, duration) {
    const destroy = () => Object.values(elements).forEach((el) => el.destroy());

    this.input.once("pointerdown", () => {
      destroy();
      resolve();
    });

    this.time.addEvent({
      callback: () => {
        destroy();
        resolve();
      },
      delay: duration
    });
  }
  showBattleScreenIntro(duration) {
    const intro = {
      bg: this.createBattleScreenBG(),
      vs: this.add.image(this.GW / 2, this.GH / 2, "1097vs").setAlpha(0),
      battle: this.add.image(this.GW / 2, 0, "Text_Battle").setDepth(15),
      mode: this.add.image(this.GW / 2, this.GH, "Text_Mode").setDepth(15)
    };

    intro.battle.y -= intro.battle.displayHeight / 2;
    intro.mode.y += intro.mode.displayHeight / 2;

    this.time.addEvent({
      callback: () => {
        this.tweens.add({
          targets: intro.vs,
          alpha: 1,
          duration: 500
        });
      },

      delay: 250
    });
    this.time.addEvent({
      callback: () => {
        this.animateSubtitles({
          upperText: intro.battle,
          bottomText: intro.mode,
          bounceOffset: 150,
          settleOffset: 250
        });
      },
      delay: 800
    });

    return new Promise((resolve) =>
      this.handleBattleScreenFinish(resolve, intro, duration)
    );
  }
}
