// components/CustomButton.tsx
import React from "react"
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { COLORS } from "@utils/constants"

interface CustomButtonProps {
  title: string
  onPress: () => void
  iconName?: keyof typeof MaterialIcons.glyphMap
  backgroundColor?: string
  textColor?: string
  style?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  iconName,
  backgroundColor = COLORS.primary,
  textColor = COLORS.white,
  style,
  textStyle,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? "#ccc" : backgroundColor },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}>
      <View style={styles.buttonContent}>
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={20}
            color={textColor}
            style={styles.icon}
          />
        )}
        <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.3,
  },
})

export default CustomButton
