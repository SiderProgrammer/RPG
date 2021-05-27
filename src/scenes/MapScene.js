import MAP_CONTENT_KEYS from "../constants/map-content-keys";
import ASSETS from "../constants/assets";
import Player from "../game_objects/Player";
import SCENES from "../constants/scenes";
import portalsHeroSpawnOrientation from "../configuration/portalsHeroSpawnOrientation";
import MapsConfig from "../configuration/maps";
import OutlinePlugin from "../helpers/OutlinePlugin";
import ObjectLayerManager from "../object_layers/Manager";
import AnimationsManager from "../animations/Manager";

const PLAYER_INITAL_POS = {
  x: 900,
  y: 900
};

export default class MapScene extends Phaser.Scene {
  constructor(key, mapKey) {
    super(key);

    window.currentMapKey = key;

    this.mapKey = mapKey;
    this.canMoveWithPointer = true;
    this.inBattle = false;
  }

  init(data) {
    this.NPCs = [];
    this.interactiveDoors = [];
    /// IMPORTANT !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // IN FUTURE the code will be broken down into managers and folders
    // STORY MANAGER , MAP MANAGER , NPC MANAGER etc.

    // IN THIS INIT FUNCTION THERE IS MUCH CODE WHICH MUSTN'T BE REPEATED WHILE CHANGING MAP
    new AnimationsManager(this).createAnimations();
    this.objectLayerManager = new ObjectLayerManager(this);
    this.outlinePlugin = new OutlinePlugin(this);

    this.input.setDefaultCursor("url(src/assets/cursors/cursor.png), pointer");
    this.createMapWithLayers();

    this.initWorldBounds();

    const { x, y } = this.getPlayerInitialPosition(data);
    this.createPlayer(x, y);

    this.createNavMesh();
    this.createFromObjectsLayers(); // Portals zones, Player, NPCs

    this.launchScenes();
    this.POP_UP_WINDOW_SCENE = this.scene.get(SCENES.POP_UP_WINDOW);

    this.initCamera();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.WSAD_keys = this.input.keyboard.addKeys("W,S,A,D");

    this.addColliders();

    this.bindEventListeners();
    this.createNavMesh();
  }

  update(delta) {
    if (!this.POP_UP_WINDOW_SCENE.isDialogueOpened) {
      // const keys = this.getKeysBooleans()
      this.player.update(this.getKeysBooleans(), delta);

      if (Object.values(this.getKeysBooleans()).some((key) => key)) {
        this.handleMovingNPCs();
      }
    }

    if (this.theObjectPlayerIsGoingTo) {
      this.checkObjectPlayerisGoingTo();
    }

    this.updateNPCs();
  }

  updateNPCs() {
    this.NPCs.forEach((npc) => {
      npc.update();
      this.updateNPCdepth(npc);
    });
  }

  updateNPCdepth(npc) {
    if (this.getPlayerDistanceFromObject(npc) > 60) return; // only if is near to npc

    if (this.player.y < npc.y) {
      this.player.setDepth(npc.depth - 1);
    } else {
      this.player.setDepth(npc.depth + 1);
    }
  }

  launchScenes() {
    this.scene.launch(SCENES.POP_UP_WINDOW);
    this.scene.moveAbove(this.scene.key, SCENES.POP_UP_WINDOW);

    this.scene.launch(SCENES.HUD);
    this.scene.moveAbove(this.scene.key, SCENES.HUD);
  }

  getPlayerInitialPosition(data) {
    let { x, y } = PLAYER_INITAL_POS;

    if (data && data.comesFrom) {
      const portal = this.map.objects
        .find((o) => o.name === MAP_CONTENT_KEYS.objects.PORTALS)
        .objects.find((portal) => portal.name === data.comesFrom);

      const past_map_scene_key = data.comesFrom;
      const new_map_scene_key = this.scene.key;

      const orientation =
        portalsHeroSpawnOrientation[
          `${past_map_scene_key}_to_${new_map_scene_key}`
        ];

      // We shift the player position because we can't make him spawn on the portal

      let shiftX = 0;
      let shiftY = 0;

      const SHIFT_VALUE = 100;

      switch (orientation) {
        case "LEFT":
          shiftX = -SHIFT_VALUE;
          break;

        case "RIGHT":
          shiftX = SHIFT_VALUE;
          break;

        case "UP":
          shiftY = -SHIFT_VALUE;
          break;

        case "DOWN":
          shiftY = SHIFT_VALUE;
          break;
      }

      x = portal.x + portal.width / 2 + shiftX;
      y = portal.y + portal.height / 2 + shiftY;
    }

    return { x, y };
  }

  unpauseNPCs() {
    this.NPCs.forEach((npc) => {
      if (npc.isStopped) {
        npc.resumeMovingByPath();
      }
      npc.isStopped = false;
    });
    // I have to make it as counter instead of boolean because npc click event is fired before move event
    this.movingNPCclicked = 0;
    this.isAnyNPCstopped = false;

    this.theObjectPlayerIsGoingTo = null;
  }
  handleMovingNPCs() {
    if (this.movingNPCclicked == 1 && this.isAnyNPCstopped) {
      this.unpauseNPCs();
    }
    this.movingNPCclicked++;
  }

  checkIfClickedBetweenDoors() {
    const tile = this.map.getTileAtWorldXY(
      this.input.activePointer.worldX + 5,
      this.input.activePointer.worldY + 5,
      null,
      null,
      this.layers.ABOVE_HIGH
    );

    if (
      tile &&
      (tile.index === 692 || tile.index === 751 || tile.index === 107)
    )
      return true;
  }

  checkIfCanEnterClickedSideOfDoors(doors) {
    // TODO * OPTIMIZE AND REDUCE THE CODE
    const number = Number(doors.name[doors.name.length - 1]);

    let secondNumber = number + 1;
    if (number % 2 == 0) {
      secondNumber = number - 1;
    }

    const secondDoors = this.interactiveDoors.find(
      (doors) => doors.name[doors.name.length - 1] == secondNumber.toString()
    );

    const firstPath = this.navMesh.findPath(
      new Phaser.Math.Vector2(this.player.x, this.player.y),
      doors.getCenter()
    );

    const secondPath = this.navMesh.findPath(
      new Phaser.Math.Vector2(this.player.x, this.player.y),
      secondDoors.getCenter()
    );

    if (!firstPath || !secondPath) return;
    let sum = 0;
    firstPath.map((point, i) => {
      if (!firstPath[i + 1]) return;

      sum += Phaser.Math.Distance.BetweenPoints(point, {
        x: firstPath[i + 1].x,
        y: firstPath[i + 1].y
      });
    });

    let sum2 = 0;

    secondPath.map((point, i) => {
      if (!secondPath[i + 1]) return;

      sum2 += Phaser.Math.Distance.BetweenPoints(point, {
        x: secondPath[i + 1].x,
        y: secondPath[i + 1].y
      });
    });

    if (sum < sum2) {
      console.log("can go");
      return true;
    } else {
      console.log("can't go");
      return false;
    }
  }

  getClickedDoors() {
    // TODO * OPTIMIZE AND REDUCE THE CODE
    return this.interactiveDoors.find((door) => {
      const bounds = door.getBounds();
      if (
        this.input.activePointer.worldX > bounds.x &&
        this.input.activePointer.worldX < bounds.x + bounds.width &&
        this.input.activePointer.worldY > bounds.y &&
        this.input.activePointer.worldY < bounds.y + bounds.height
      ) {
        return door;
      }
    });
  }
  bindEventListeners() {
    this.input.on("pointerdown", () => {
      // this.player.x = this.input.activePointer.worldX;
      // this.player.y = this.input.activePointer.worldY;

      if (this.checkIfClickedBetweenDoors()) return;

      if (
        this.canMoveWithPointer &&
        !this.POP_UP_WINDOW_SCENE.isDialogueOpened
      ) {
        this.handleMovingNPCs();

        const end = {
          x: this.input.activePointer.worldX,
          y:
            this.input.activePointer.worldY - this.player.displayHeight / 2 + 30
        };

        const doors = this.getClickedDoors();

        if (!doors) {
          this.player.playerGoTo(end, true);
          return;
        }

        if (this.checkIfCanEnterClickedSideOfDoors(doors))
          this.player.playerGoTo(end, true);

        //  this.navMesh.debugDrawPath(path, 0xffd900);
      }
      this.canMoveWithPointer = true;
    });
  }

  initWorldBounds() {
    this.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }

  getPlayerDistanceFromObject(object) {
    return Math.sqrt(
      (this.player.x - object.x) ** 2 + (this.player.y - object.y) ** 2
    );
  }

  createFromObjectsLayers() {
    this.map.objects.map((obj) => {
      switch (obj.name) {
        case MAP_CONTENT_KEYS.objects.PORTALS:
          this.objectLayerManager.createPortalZones(obj);
          break;
        case MAP_CONTENT_KEYS.objects.NPCS:
          this.objectLayerManager.createNPCs(obj);
          break;
        case MAP_CONTENT_KEYS.objects.ITEMS:
          this.objectLayerManager.createItems(obj);
          break;
        case MAP_CONTENT_KEYS.objects.ENEMYS:
          this.objectLayerManager.createEnemies(obj);
          break;
      }
    });
  }

  objectClickCallback({
    object,
    distance,
    dialogue,
    closeDialogueCallback = function () {}
  }) {
    const showDialogueWindow = () => {
      this.POP_UP_WINDOW_SCENE.showDialogueWindow(
        dialogue,
        object.texture.key,
        closeDialogueCallback
      );
    };

    if (this.getPlayerDistanceFromObject(object) >= distance) {
      this.player.playerGoTo({ x: object.x, y: object.y });

      this.theObjectPlayerIsGoingTo = object;

      this.checkObjectPlayerisGoingTo = () => {
        if (
          this.getPlayerDistanceFromObject(this.theObjectPlayerIsGoingTo) <=
          distance
        ) {
          this.player.stopMovingByPath();

          this.theObjectPlayerIsGoingTo = undefined;
          this.canMoveWithPointer = false;
          showDialogueWindow();
        }
      };
      return;
    }

    this.canMoveWithPointer = false;
    showDialogueWindow();
  }

  // getShadowPos(portal){
  // const maxWidth = this.map.widthInPixels
  // const maxHeight = this.map.heightInPixels

  //   const origin = {
  //     x:0,
  //     y:0
  //   }
  // if(maxWidth - portal.x < 100){
  //   origin.x = 1;
  // }else{
  //   origin.x
  // }

  // }

  // createPortalShadow(portal) {
  //   const shadowOrigin = this.getShadowOrigin(portal)
  //   const shadow = this.add.image(portal.x, portal.y, "shadow_up").setOrigin(0);

  //   const widthThickness = 30;

  //   const SPAWN_ORIENTATION = portal.properties.find(
  //     (prop) => prop.name === "spawn_orientation"
  //   ).value;

  //   if (SPAWN_ORIENTATION === "DOWN") {
  //     shadow.displayWidth = portal.width;
  //     shadow.displayHeight = widthThickness;
  //     shadow.setTexture("shadow_down");
  //   } else if (SPAWN_ORIENTATION === "LEFT") {
  //     shadow.setTexture("shadow_left");
  //     shadow.displayWidth = widthThickness;
  //     shadow.displayHeight = portal.height;
  //   }
  // }

  createMapWithLayers() {
    this.map = this.make.tilemap({ key: this.mapKey });

    const TILESETS = {};

    const exsists = (name) => {
      return MAP_TILESETS.some((tileset) => tileset === name);
    };
    const MAP_TILESETS = MapsConfig[this.scene.key.toUpperCase()].TILESETS;
    // const MAP_TILESETS = this.cache.tilemap.entries.entries[this.scene.key].data.tilesets.map(tileset=>tileset.name);
    // const exsists = (name) => {
    //   return MAP_TILESETS.some((tileset) => tileset === name);
    // };

    if (exsists("ALL_TERRAIN")) {
      TILESETS.ALL_TERRAIN = this.map.addTilesetImage(
        ASSETS.ALL_TERRAIN,
        ASSETS.ALL_TERRAIN
      );
    }

    if (exsists("SHADOWS")) {
      TILESETS.SHADOWS = this.map.addTilesetImage(
        ASSETS.SHADOWS,
        ASSETS.SHADOWS
      );
    }

    if (exsists("EXTRA_OBJECTS")) {
      TILESETS.EXTRA_OBJECTS = this.map.addTilesetImage(
        ASSETS.EXTRA_OBJECTS,
        ASSETS.EXTRA_OBJECTS
      );
    }

    if (exsists("GRASSLAND_HILLS_ROCKS")) {
      TILESETS.GRASSLAND_HILLS_ROCKS = this.map.addTilesetImage(
        ASSETS.GRASSLAND_HILLS_ROCKS,
        ASSETS.GRASSLAND_HILLS_ROCKS
      );
    }
    if (exsists("TREES_TENTS")) {
      TILESETS.TREES_TENTS = this.map.addTilesetImage(
        ASSETS.TREES_TENTS,
        ASSETS.TREES_TENTS
      );
    }
    if (exsists("TOWN")) {
      TILESETS.TOWN = this.map.addTilesetImage(ASSETS.TOWN, ASSETS.TOWN);
    }
    if (exsists("TOWN_INTERIOR")) {
      TILESETS.TOWN_INTERIOR = this.map.addTilesetImage(
        ASSETS.TOWN_INTERIOR,
        ASSETS.TOWN_INTERIOR
      );
    }

    if (exsists("INTERIOR_OBJECTS")) {
      TILESETS.INTERIOR_OBJECTS = this.map.addTilesetImage(
        ASSETS.INTERIOR_OBJECTS,
        ASSETS.INTERIOR_OBJECTS
      );
    }

    const GROUND_TILESETS = [
      TILESETS.ALL_TERRAIN,
      TILESETS.TOWN_INTERIOR,
      TILESETS.INTERIOR_OBJECTS
    ];

    const SHADOWS_TILESETS = [
      TILESETS.SHADOWS,
      TILESETS.TOWN_INTERIOR,
      TILESETS.INTERIOR_OBJECTS
    ];

    const DECORATIONS_TILESETS = [
      TILESETS.ALL_TERRAIN,
      TILESETS.EXTRA_OBJECTS,
      TILESETS.GRASSLAND_HILLS_ROCKS,
      TILESETS.TOWN_INTERIOR,
      TILESETS.INTERIOR_OBJECTS,
      TILESETS.SHADOWS
    ];

    const OBSTACLES_LOW_TILESETS = [
      TILESETS.TOWN,
      TILESETS.GRASSLAND_HILLS_ROCKS,
      TILESETS.EXTRA_OBJECTS,
      TILESETS.ALL_TERRAIN,
      TILESETS.TOWN_INTERIOR,
      TILESETS.INTERIOR_OBJECTS,
      TILESETS.TREES_TENTS
    ];

    const OBSTACLES_HIGH_TILESETS = [
      TILESETS.TOWN,
      TILESETS.EXTRA_OBJECTS,
      TILESETS.ALL_TERRAIN,
      TILESETS.TOWN_INTERIOR,
      TILESETS.INTERIOR_OBJECTS,
      TILESETS.SHADOWS
    ];

    const ABOVE_LOW_TILESETS = [
      TILESETS.GRASSLAND_HILLS_ROCKS,
      TILESETS.SHADOWS,
      TILESETS.TOWN,
      TILESETS.TREES_TENTS,
      TILESETS.EXTRA_OBJECTS,
      TILESETS.TOWN_INTERIOR,
      TILESETS.INTERIOR_OBJECTS
    ];

    const ABOVE_HIGH_TILESETS = [
      TILESETS.ALL_TERRAIN,
      TILESETS.TOWN,
      TILESETS.GRASSLAND_HILLS_ROCKS,
      TILESETS.TREES_TENTS,
      TILESETS.TOWN_INTERIOR,
      TILESETS.INTERIOR_OBJECTS
    ];

    const ROCK_BEFORE_TILESETS = [
      TILESETS.GRASSLAND_HILLS_ROCKS,
      TILESETS.TOWN_INTERIOR,
      TILESETS.INTERIOR_OBJECTS
    ];

    this.layers = {
      GROUND: this.map.createLayer(
        MAP_CONTENT_KEYS.layers.GROUND,
        GROUND_TILESETS
      ),
      SHADOWS: this.map.createLayer(
        MAP_CONTENT_KEYS.layers.SHADOWS,
        SHADOWS_TILESETS
      ),

      DECORATIONS: this.map.createLayer(
        MAP_CONTENT_KEYS.layers.DECORATIONS,
        DECORATIONS_TILESETS
      ),

      OBSTACLES_LOW: this.map.createLayer(
        MAP_CONTENT_KEYS.layers.OBSTACLES_LOW,
        OBSTACLES_LOW_TILESETS
      ),

      OBSTACLES_HIGH: this.map.createLayer(
        MAP_CONTENT_KEYS.layers.OBSTACLES_HIGH,
        OBSTACLES_HIGH_TILESETS
      ),
      ABOVE_LOW: this.map
        .createLayer(MAP_CONTENT_KEYS.layers.ABOVE_LOW, ABOVE_LOW_TILESETS)
        .setDepth(10),
      ABOVE_HIGH: this.map
        .createLayer(MAP_CONTENT_KEYS.layers.ABOVE_HIGH, ABOVE_HIGH_TILESETS)
        .setDepth(10)
    };

    // rock before is not available in all maps
    const LAYERS = this.cache.tilemap.entries.entries[
      this.scene.key
    ].data.layers.map((layer) => layer.name);

    if (LAYERS.some((el) => el === "rock before")) {
      this.layers.ROCK_BEFORE = this.map
        .createLayer(MAP_CONTENT_KEYS.layers.ROCK_BEFORE, ROCK_BEFORE_TILESETS)
        .setDepth(10);
    }

    this.layers.OBSTACLES_LOW.setCollisionByExclusion([-1]);
    this.layers.OBSTACLES_HIGH.setCollisionByExclusion([-1]);
  }

  createNavMesh() {
    const layers = [this.layers.OBSTACLES_LOW, this.layers.OBSTACLES_HIGH];

    this.navMesh = this.navMeshPlugin.buildMeshFromTilemap(
      // waiting for shrink feature
      "mesh_1",
      this.map,
      layers
    );

    // const graphics = this.add.graphics(0, 0).setAlpha(0.5);
    // this.navMesh.enableDebug(graphics);
    // const drawDebug = () => {
    //   this.navMesh.debugDrawClear();
    //   this.navMesh.debugDrawMesh({
    //     drawCentroid: true,
    //     drawBounds: false,
    //     drawNeighbors: false,
    //     drawPortals: false
    //   });
    // };
    // drawDebug();
  }

  getKeysBooleans() {
    return {
      left: this.cursors.left.isDown || this.WSAD_keys.A.isDown,
      right: this.cursors.right.isDown || this.WSAD_keys.D.isDown,
      up: this.cursors.up.isDown || this.WSAD_keys.W.isDown,
      down: this.cursors.down.isDown || this.WSAD_keys.S.isDown
    };
  }

  createPlayer(x, y) {
    this.player = new Player(this, x, y);
  }

  initCamera() {
    this.cameras.main.setRoundPixels(true);

    const setBounds = () => {
      if (!this.cameras.main) return;
      this.cameras.main.setBounds(
        this.scale.canvasBounds.left,
        this.scale.canvasBounds.top,
        this.map.widthInPixels + Math.abs(this.scale.canvasBounds.left),
        this.map.heightInPixels + Math.abs(this.scale.canvasBounds.top) + 300
      );
    };

    setBounds();

    this.cameras.main.startFollow(this.player, true);

    this.scale.on("resize", setBounds, this);
  }

  addColliders() {
    this.physics.add.collider(this.player, this.layers.OBSTACLES_LOW);
    this.physics.add.collider(this.player, this.layers.OBSTACLES_HIGH);
  }
  enterBattle() {
    this.inBattle = true;
    this.scene.sleep();
    this.player.stopMovingByPath();
  }

  leaveBattle() {
    this.player.x += 10; // handle it later
    this.inBattle = false;

    this.scene.wake();
  }

  collideEnemyNPC(enemy, player) {
    if (this.inBattle) return;
    this.enterBattle();
    this.scene.launch(SCENES.BATTLE, {
      enemy,
      player,
      currentMapScene: this
    });
    this.scene.moveAbove(SCENES.HUD, SCENES.BATTLE);
  }
}
