module.exports = (bundler) => {
    bundler.addAssetType("pug", require.resolve("./asset"));
}