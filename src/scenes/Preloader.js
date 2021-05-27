import MAPS from "../constants/maps";
import ASSETS from "../constants/assets";
import SCENES from "../constants/scenes";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }
  preload() {
    this.load.setPath("src/assets");
    this.loadAssets();
  }

  create() {
    this.scene.start(SCENES.MAP_1);
  }

  loadAssets() {
    this.loadTileMaps();
    this.loadHelpers();
    this.loadTileSets();
    this.loadBackgrounds();
    this.loadSpriteSheets();
    this.loadItems();
    this.loadUIelements();

    this.loadDialougeWidgetItems();
    this.loadCharacterWidgetItems();
    this.loadManaWidgetItems();

    this.loadBattleScreenItems();
    this.loadBattleScreenIntro();
    this.loadBattleScreenEscape();
    this.loadBattleScreenWin();
  }

  loadTileset(key) {
    this.load.image(key, `Tilesets/${key}.png`);
  }

  loadTiledJSON(key, file) {
    this.load.tilemapTiledJSON(key, `TileMaps/${file}`);
  }

  loadTileMaps() {
    this.loadTiledJSON(MAPS.map_1.key, MAPS.map_1.file);
    this.loadTiledJSON(MAPS.map_2.key, MAPS.map_2.file);
    this.loadTiledJSON(MAPS.map_3.key, MAPS.map_3.file);
    this.loadTiledJSON(MAPS.map_5.key, MAPS.map_5.file);
  }

  loadTileSets() {
    this.loadTileset(ASSETS.ALL_TERRAIN);
    this.loadTileset(ASSETS.EXTRA_OBJECTS);
    this.loadTileset(ASSETS.GRASSLAND_HILLS_ROCKS);
    this.loadTileset(ASSETS.INTERIOR_OBJECTS);
    this.loadTileset(ASSETS.MINE);
    this.loadTileset(ASSETS.SHADOWS);
    this.loadTileset(ASSETS.TOWN);
    this.loadTileset(ASSETS.TOWN_INTERIOR);
    this.loadTileset(ASSETS.TREES_TENTS);
  }

  loadBattleScreenIntro() {
    const URL = "BattleScreen/intro";
    this.load.image("1097", `${URL}/1097.jpg`);
    this.load.image("1097vs", `${URL}/1097vs.png`);
    this.load.image("Text_Battle", `${URL}/Text_Battle.png`);
    this.load.image("Text_Mode", `${URL}/Text_Mode.png`);
  }

  loadBattleScreenEscape() {
    const URL = "BattleScreen/escape";

    this.load.image("Escape_Arrow", `${URL}/Escape_Arrow.png`);
    this.load.image("Escaped_1", `${URL}/Escaped_1.png`);
    this.load.image("Escaped_2", `${URL}/Escaped_2.png`);
  }

  loadBattleScreenWin() {
    const URL = "BattleScreen/victory";
    this.load.image("Emblem", `${URL}/Emblem.png`);
    this.load.image("Text_Victory", `${URL}/Text_Victory.png`);
  }

  loadHelpers() {
    this.load.image("black_square", "helpers/black_square.png");
    this.load.image("shadow_up", "helpers/shadow_up.png");
    this.load.image("shadow_down", "helpers/shadow_down.png");
    this.load.image("shadow_left", "helpers/shadow_left.png");
    this.load.image("shadow_right", "helpers/shadow_right.png");
  }

  loadBattleScreenItems() {
    this.load.image("Action_Attack", "BattleScreen/Action_Attack.png");
    this.load.image("Action_Heal", "BattleScreen/Action_Heal.png");
    this.load.image("Action_Run", "BattleScreen/Action_Run.png");
    this.load.image("Avatar_Frame", "BattleScreen/Avatar_Frame.png");
    this.load.image("Health_Bar", "BattleScreen/Health_Bar.png");
  }

  loadUIelements() {
    this.load.image("Dialogue_bubble", "UI/Dialogue_bubble.png");
    this.load.image("Exit_arrow", "UI/Exit_arrow.png");
    this.load.image("Door_Lock", "UI/Door_Lock.png");
  }
  loadItems() {
    this.load.image("town@64x64_doors_up", "items/town@64x64_doors_up.png");
    this.load.image(
      "TownInterior@64x64_doors_down",
      "items/TownInterior@64x64_doors_down.png"
    );
  }

  loadSpriteSheets() {
    this.load.spritesheet("attack", `./attack.png`, {
      frameWidth: 500,
      frameHeight: 255
    });

    this.load.spritesheet(
      "Sten0001_Rookie_attack",
      `characters/enemy/animations/Sten0001_Rookie_attack.png`,
      {
        frameWidth: 175,
        frameHeight: 185
      }
    );

    this.load.spritesheet(
      "Sten0001_Rookie_idle",
      `characters/enemy/animations/Sten0001_Rookie_idle.png`,
      {
        frameWidth: 125,
        frameHeight: 134
      }
    );

    this.load.spritesheet(
      ASSETS.PLAYER,
      `characters/player/${ASSETS.PLAYER}.png`,
      {
        frameWidth: 64,
        frameHeight: 96
      }
    );

    // sample NPC
    this.load.spritesheet(
      ASSETS.NPC_CIVILIAN_MALE_1,
      `characters/npc/${ASSETS.NPC_CIVILIAN_MALE_1}.png`,
      {
        frameWidth: 64,
        frameHeight: 96
      }
    );

    this.load.spritesheet(
      "pointer-destination",
      "pointer-spritesheets/pointer-destination.png",
      {
        frameWidth: 85,
        frameHeight: 85
      }
    );

    // sample item
    this.load.spritesheet("CampFireFinished", "items/CampFireFinished.png", {
      frameWidth: 320 / 5,
      frameHeight: 64
    });

    // sample enemy NPC
    this.load.spritesheet(
      ASSETS.MONSTER_1,
      `characters/enemy/${ASSETS.MONSTER_1}.png`,
      {
        frameWidth: 785 / 5,
        frameHeight: 350 / 3
      }
    );
  }

  loadBackgrounds() {
    const URL = "backgrounds/2D_Horizontal_battle_Enviroment_01";
    this.load.image("Layer01", `${URL}/Layer01.png`);
    this.load.image("Layer02", `${URL}/Layer02.png`);
    this.load.image("Layer03", `${URL}/Layer03.png`);
  }
  loadDialougeWidgetItems() {
    const URL = "widgets/dialogue";
    this.load.image("Dialog_AvatarFrame", `${URL}/Dialog_AvatarFrame.png`);
    this.load.image("DialogButton", `${URL}/DialogButton.png`);
    this.load.image("DialogClose", `${URL}/DialogClose.png`);
    this.load.image("DialogScroll", `${URL}/DialogScroll.png`);
    this.load.image("DialogueFrame", `${URL}/DialogueFrame.png`);
  }
  loadManaWidgetItems() {
    const URL = "widgets/mana";

    this.load.image("manaWidgetBubble", `${URL}/bubble.png`);
    this.load.image("manaWidgetBrain", `${URL}/brain.png`);
    this.load.image("manaWidgetFrame", `${URL}/frame.png`);
    this.load.image("manaWidgetFill", `${URL}/fill.png`);
    this.load.image("manaWidgetGlow", `${URL}/glow.png`);
    this.load.image("manaWidgetGlowDouble", `${URL}/glow_double.png`);
  }

  loadCharacterWidgetItems() {
    const URL = "widgets/character";

    this.load.image("characterWidget", `${URL}/avatar_example.png`);
    this.load.image("characterWidgetGlow", `${URL}/glow.png`);
    this.load.image("characterWidgetFrame", `${URL}/frame.png`);
    this.load.image("characterWidgetRing", `${URL}/ring.png`);
  }
}
