const { getDefaultConfig } = require("expo/metro-config")
const { mergeConfig } = require("metro-config")
const { withNativeWind } = require("nativewind/metro")

const defaultConfig = getDefaultConfig(__dirname)

// First, create your custom config including SVG transformer
const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
  },
}

// Merge default and custom config
const mergedConfig = mergeConfig(defaultConfig, customConfig)

// Finally, wrap with nativewind support, passing merged config and options if any
module.exports = withNativeWind(mergedConfig, {
  input: "./global.css", // your nativewind input file, adjust if different
})
