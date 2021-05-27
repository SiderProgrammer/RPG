//import Phaser from "phaser";
//import PhaserNavMeshPlugin from "phaser-navmesh";
import scenes from "./scenes";
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline-plugin.js";

export default {
  type: Phaser.AUTO,
  parent: "game",
  width: window.screen.width, // TODO - on phone it should be "100%"
  height: window.screen.height, // TODO - on phone it should be "100%"
  scene: scenes,
  scale: {
    mode: Phaser.Scale.ENVELOP, // Phaser.Scale.ENVELOP, //
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  plugins: {
    scene: [
      {
        key: "PhaserNavMeshPlugin", // Key to store the plugin class under in cache
        plugin: PhaserNavMeshPlugin, // Class that constructs plugins
        mapping: "navMeshPlugin", // Property mapping to use for the scene, e.g. this.navMeshPlugin
        start: true
      }
    ],
    global: [
      {
        key: "rexOutlinePipeline",
        plugin: OutlinePipelinePlugin,
        start: true
      }
    ]
  },
  scene: scenes,

  physics: {
    default: "arcade",
    arcade: {
      // debug: true
    }
  },

  render: {
    clearBeforeRender: false
  },
  pixelArt: true
};
