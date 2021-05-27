import Phaser from "phaser";
import config from "./main/game-config";

const createGame = () => {
  const game = new Phaser.Game(config);
  if (!game.device.os.desktop) game.input.mouse.enabled = false; // disable double click on mobile devices
};

window.onload = createGame;
