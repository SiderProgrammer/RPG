export default function createPortalZones(scene, obj) {
  obj.objects.map((portal) => {
    const zone = scene.add
      .zone(portal.x, portal.y, portal.width, portal.height)
      .setOrigin(0, 0);

    // if (portal.properties[0].name !== "no_shadow") {
    //   scene.createPortalShadow(portal);
    // }
    // -------------

    scene.physics.add.existing(zone);

    if (portal.name.includes("map")) {
      scene.physics.add.overlap(zone, scene.player, () => {
        scene.scene.start(portal.name, { comesFrom: scene.scene.key });
      });
    } else {
      scene.physics.add.overlap(zone, scene.player, () => {
        // const d = scene.interactiveDoors.filter((door) =>
        //   Phaser.Geom.Intersects.RectangleToRectangle(zone.getBounds();, door.getBounds();)
        // );
        // console.log(d);
        // zone.getBounds();

        const teleportValue = 235;
        const portalName = portal.name;

        let x = 0;
        let y = 0;

        if (portalName.includes("left")) {
          x = -teleportValue;
        } else if (portalName.includes("right")) {
          x = teleportValue;
        } else if (portalName.includes("up")) {
          y = -teleportValue;
        } else if (portalName.includes("down")) {
          y = teleportValue;
        }

        scene.player.x += x;
        scene.player.y += y;

        if (scene.player.movingTween) scene.player.movingTween.stop();

        const tempBounds = zone.getBounds();
        const additionalClickSize = teleportValue * 0.1;

        tempBounds.width += additionalClickSize;
        tempBounds.height += additionalClickSize;

        if (portalName.includes("right")) {
          tempBounds.x -= additionalClickSize;
        }

        if (portalName.includes("left")) {
          tempBounds.width += additionalClickSize;
          tempBounds.x -= additionalClickSize;
        }

        if (portalName.includes("down")) {
          tempBounds.y -= additionalClickSize;
        }

        if (portalName.includes("up")) {
          tempBounds.height += additionalClickSize;
          tempBounds.y -= additionalClickSize;
        }

        if (
          !tempBounds.contains(
            scene.player.lastDestinationPoint.x,
            scene.player.lastDestinationPoint.y
          )
        ) {
          scene.player.playerGoTo(scene.player.lastDestinationPoint, true);
        } else {
          scene.player.onPathEnd();
        }
      });
    }
  });
}
