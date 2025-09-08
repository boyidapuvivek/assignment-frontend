const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config")

const defaultConfig = getDefaultConfig(__dirname)

const {
  resolver: { sourceExts, assetExts },
} = getDefaultConfig(__dirname)

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    assetPlugins: ["expo-asset/tools/hashAssetFiles"], // Add this for Expo projects
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...sourceExts, "svg"],
  },
}

module.exports = mergeConfig(defaultConfig, config)
