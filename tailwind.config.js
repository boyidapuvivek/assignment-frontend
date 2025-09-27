// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        // Poppins font variants
        "poppins-regular": ["Poppins-Regular"],
        "poppins-light": ["Poppins-Light"],
        "poppins-medium": ["Poppins-Medium"],
        "poppins-semibold": ["Poppins-SemiBold"],
        "poppins-bold": ["Poppins-Bold"],
        "poppins-extrabold": ["Poppins-ExtraBold"],
        "poppins-black": ["Poppins-Black"],
        "poppins-thin": ["Poppins-Thin"],
        "poppins-extralight": ["Poppins-ExtraLight"],

        // Italic variants
        "poppins-italic": ["Poppins-Italic"],
        "poppins-light-italic": ["Poppins-LightItalic"],
        "poppins-medium-italic": ["Poppins-MediumItalic"],
        "poppins-semibold-italic": ["Poppins-SemiBoldItalic"],
        "poppins-bold-italic": ["Poppins-BoldItalic"],
        "poppins-extrabold-italic": ["Poppins-ExtraBoldItalic"],
        "poppins-black-italic": ["Poppins-BlackItalic"],
        "poppins-thin-italic": ["Poppins-ThinItalic"],
        "poppins-extralight-italic": ["Poppins-ExtraLightItalic"],
      },
      colors: {
        primary: "#2196F3",
        secondary: "#D3E4F0",
        white: "#fefefe",
        danger: "#f44336",
        warning: "#FF9800",
        background: "#f5f5f5",
        textwhite: "#fefefe",
        textblack: "#010101",
        subtext: "#222222",
        paragraph: "#555555",
        black4: "#444444",
        buttonblue: "#2094F3",
      },
    },
  },
  plugins: [],
}
