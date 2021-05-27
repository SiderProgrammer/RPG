import ITEMS_CONFIG from "../configuration/items";

function createItems(scene, obj) {
  const hoverCallback = (item) => {
    scene.outlinePlugin.setOutline({ object: item });

    const outline = scene.outlinePlugin.setOutline({
      object: item,
      thickness: 2,
      outlineColor: 0xff0000
    });

    let delay = 250;

    if (item.name.includes("doors")) {
      delay = 500;
    }

    scene.outlineFadeInOut = scene.time.addEvent({
      delay,
      repeat: -1,
      callback: () => {
        if (outline.thickness > 0) {
          outline.setThickness(0);
        } else {
          outline.setThickness(2);
        }
      }
    });
  };

  const leaveCallback = (item) => {
    scene.outlinePlugin.remove(item);
    scene.outlineFadeInOut.destroy();
  };

  obj.objects.map((_item) => {
    const item = scene.physics.add.image(
      _item.x,
      _item.y,
      ITEMS_CONFIG[_item.name]?.assets?.image || "CampFireFinished"
    );
    item.name = _item.name;

    if (item.name.includes("doors")) {
      item.blackSquare = scene.add
        .image(item.x, item.y, "black_square")
        .setOrigin(0)
        .setDisplaySize(_item.width, _item.height);

      item
        .setImmovable(true)
        .setTexture("black_square")
        .setDisplaySize(_item.width, _item.height)
        .setSize(_item.width / 3, _item.height / 3);
      item.blackSquare.setVisible(false);

      handleDoors(scene, item);
    }

    if (
      item.name.includes("doors") &&
      Number(item.name[item.name.length - 1]) // has number at the end so scene door is just teleporting by changing player position (not teleporting to other map)
    ) {
      if (item.unlocked) {
        item.body.checkCollision.none = true;
      } else {
        item.blackSquare.setVisible(false);
        item.lockedIcon = scene.add.image(
          item.blackSquare.getCenter().x,
          item.blackSquare.getCenter().y,
          "Door_Lock"
        );

        const tile = scene.map.getTileAtWorldXY(
          item.x + 5,
          item.y + 5,
          null,
          null,
          scene.layers.GROUND
        );

        scene.map.removeTileAtWorldXY(
          item.x + 5,
          item.y + 5,
          null,
          null,
          null,
          scene.layers.GROUND
        );

        scene.map.putTileAtWorldXY(
          tile.index,
          item.x + 5,
          item.y + 5,
          false,
          false,
          scene.layers.OBSTACLES_LOW
        );

        scene.map.setCollision(
          tile.index,
          true,
          false,
          scene.layers.OBSTACLES_LOW
        );

        item.unlock = () => {
          item.unlocked = true;
          item.body.checkCollision.none = true;
          item.lockedIcon.destroy();
          item.blackSquare.setVisible(true);

          scene.map.removeTileAtWorldXY(
            item.x + 5,
            item.y + 5,
            null,
            null,
            null,
            scene.layers.OBSTACLES_LOW
          );

          scene.createNavMesh();
        };
      }

      scene.interactiveDoors.push(item);
    }
    // if (!ITEMS_CONFIG[_item.name]) return; // || !ITEMS_CONFIG[_item.name].dialog

    item.setInteractive();

    item.on("pointerover", () => hoverCallback(item));
    item.on("pointerout", () => leaveCallback(item));

    if (ITEMS_CONFIG[_item.name]) {
      const distance = ITEMS_CONFIG[_item.name].distanceToDialogue;
      const dialogue = ITEMS_CONFIG[_item.name].dialog;

      item.on("pointerdown", () =>
        scene.objectClickCallback({ object: item, distance, dialogue })
      );
    }
  });
}
function handleDoors(scene, item) {
  const name = item.name;
  item.setAlpha(0.05);
  item.setOrigin(0);

  const shift = {
    x: 0,
    y: 0
  };

  let arrowOrientation = "down";

  item.on("pointerover", () => {
    if (name.includes("up")) {
      shift.y = 105;
      arrowOrientation = "up";
    } else if (name.includes("down")) {
      shift.y = -105 + item.displayHeight;
    } else if (name.includes("left")) {
      shift.x = 105;
      shift.y = item.displayHeight / 3;
      arrowOrientation = "left";
    } else if (name.includes("right")) {
      shift.x = -105;
      shift.y = item.displayHeight / 3;
      arrowOrientation = "right";
    }

    item.arrow = scene.add.image(
      item.x + shift.x + item.displayWidth / 2,
      item.y + shift.y * 1.5,
      "Exit_arrow"
    );

    if (arrowOrientation === "up") {
      item.arrow.setAngle(180);
    } else if (arrowOrientation === "left") {
      item.arrow.setAngle(90);
    } else if (arrowOrientation === "right") {
      item.arrow.setAngle(270);
    }

    const moveProperties = {
      y: "+=0",
      x: "+=0"
    };
    if (shift.y && !shift.x < 0) {
      moveProperties.y = "+=25";
    } else if (shift.y && !shift.x > 0) {
      moveProperties.y = "-=25";
    } else if (shift.x < 0) {
      moveProperties.x = "+=25";
    } else {
      moveProperties.x = "-=25";
    }

    scene.tweens.add({
      targets: item.arrow,
      repeat: -1,
      duration: 500,
      yoyo: true,
      ...moveProperties
    });
  });

  item.on("pointerout", () => {
    item.arrow.destroy();
  });

  item.on("pointerdown", () => {
    if (!item.unlocked && item.unlock) {
      // if door is locked and interactive (has .unlock property)
      unlockDoors(scene, item.name[item.name.length - 1]);
    }

    if (Number(item.name[item.name.length - 1])) return; // just for now

    if (scene.canMoveWithPointer) {
      const end = {
        x: item.x + item.displayWidth / 2,
        y: item.y + shift.y
      };

      scene.player.playerGoTo(end);

      // scene.navMesh.debugDrawPath(path, 0xffd900);
    }
    scene.canMoveWithPointer = true;
  });
}
function unlockDoors(scene, number) {
  if (number % 2 == 0) return; // can't open doors from behind
  scene.interactiveDoors.forEach((door) => {
    if (
      Number(door.name[door.name.length - 1]) == parseInt(number) ||
      Number(door.name[door.name.length - 1]) == parseInt(number) + 1
    ) {
      door.unlock();
    }
  });
}

export default createItems;
