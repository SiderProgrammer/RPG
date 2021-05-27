export default class OutlinePlugin {
  constructor(scene) {
    this.scene = scene;
    this.outlinePlugin = this.scene.plugins.get("rexOutlinePipeline");
  }

  setOutline(config) {
    if (!config.thickness) {
      config = {
        object: config.object,
        thickness: 3,
        outlineColor: 0xffffff
      };
    }

    const { object, thickness, outlineColor } = config;

    return this.outlinePlugin.add(object, {
      thickness,
      outlineColor
    });
  }

  remove(object) {
    this.outlinePlugin.remove(object);
  }
}
