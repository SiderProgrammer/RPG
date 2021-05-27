export default function createPointerAnimation(game) {
  game.anims.create({
    key: "destination",
    frames: game.anims.generateFrameNumbers("pointer-destination"),
    frameRate: 10,
    repeat: -1
  });
}
