module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
            "@assets": "./assets",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@context": "./src/context",
            "@hooks": "./src/hooks",
            "@types": "./src/types",
            "@navigation": "./src/navigation",
            "@utils": "./src/utils",
            "@api": "./src/api",
          },
        },
      ],
      "react-native-reanimated/plugin",
      "react-native-worklets/plugin",
    ],
    env: {
      production: {
        plugins: ["react-native-paper/babel"],
      },
    },
  }
}
