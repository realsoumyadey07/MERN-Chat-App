module.exports = function (api: any) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [["module:react-native-dotenv"]],
  };
};
