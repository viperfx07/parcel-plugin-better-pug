const path = require("path");
const localRequire = (function() {
  try {
    return require("parcel/src/utils/localRequire");
  } catch (e) {
    return require("parcel-bundler/src/utils/localRequire");
  }
})();

const PugAsset = (function() {
  try {
    return require("parcel/src/assets/PugAsset");
  } catch (e) {
    return require("parcel-bundler/src/assets/PugAsset");
  }
})();

class BetterPugAsset extends PugAsset {
  async generate() {
    const pug = await localRequire("pug", this.name);
    const config =
      (await this.getConfig([".pugrc", ".pugrc.js", "pug.config.js"])) || {};

    const compiled = pug.compile(this.contents, {
      compileDebug: false,
      filename: this.name,
      basedir: path.dirname(this.name),
      pretty: config.pretty || false,
      plugins: config.plugins || [],
      templateName: path.basename(this.basename, path.extname(this.basename)),
      filters: config.filters,
      filterOptions: config.filterOptions,
      filterAliases: config.filterAliases
    });

    if (compiled.dependencies) {
      for (let item of compiled.dependencies) {
        this.addDependency(item, {
          includedInParent: true
        });
      }
    }

    return compiled(config.locals);
  }
}

module.exports = BetterPugAsset;
