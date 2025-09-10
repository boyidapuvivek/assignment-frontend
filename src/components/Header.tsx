import React from "react"
import { StyleSheet, View } from "react-native"
import { COLORS } from "../utils/constants"
import Logo from "../../assets/icon_logo.svg"

const Header = () => {
  return (
    <View style={styles.container}>
      //add 20 horizontal padding //to left of the screen
      <Logo
        height={40}
        width={40}
      />
      <View>
        //to be at right of the screen //notification icon for present
        placeholder //profile pic on click navigate to profile
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    height: 60,
  },
})
