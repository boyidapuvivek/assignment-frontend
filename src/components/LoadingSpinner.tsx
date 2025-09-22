import React from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { COLORS } from "../utils/constants"

const LoadingSpinner: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size='large'
        color='#2196F3'
      />
    </View>
  )
}

export default LoadingSpinner

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
})
