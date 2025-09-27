// components/CustomButton.tsx
import React from "react"
import { TouchableOpacity, Text, ActivityIndicator } from "react-native"

interface CustomButtonProps {
  title: string
  onPress: () => void
  children?: React.ReactNode
  iconPosition?: "left" | "right"
  iconOnly?: boolean
  disabled?: boolean
  loading?: boolean
  className?: string
  textStyles?: string
  fullWidth?: boolean
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  children,
  iconPosition = "left",
  iconOnly = false,
  disabled = false,
  loading = false,
  className = "",
  textStyles = "",
  fullWidth = false,
}) => {
  // Default button styles - applied when no className is provided
  const defaultStyles =
    className.trim() === "" ? "bg-buttonblue px-4 py-3 rounded-lg" : className

  // Base classes that are always applied
  const baseClasses = "flex-row items-center justify-center active:opacity-80"
  const layoutClasses = fullWidth ? "w-full" : iconOnly ? "aspect-square" : ""
  const disabledClasses = disabled || loading ? "opacity-50" : ""
  const gapClasses = children && !iconOnly ? "gap-2" : ""

  // Combine all classes
  const buttonClassName =
    `${baseClasses} ${layoutClasses} ${defaultStyles} ${gapClasses} ${disabledClasses}`.trim()

  // Default text styles
  const textClasses =
    className.trim() === "" ? "text-white text-sm font-medium" : textStyles

  return (
    <TouchableOpacity
      className={buttonClassName}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {/* Left Icon */}
      {children && iconPosition === "left" && !loading && children}

      {/* Loading Indicator */}
      {loading && (
        <ActivityIndicator
          size='small'
          color={className.trim() === "" ? "white" : "#374151"}
        />
      )}

      {/* Title Text */}
      {!iconOnly && <Text className={textClasses}>{title}</Text>}

      {/* Right Icon */}
      {children && iconPosition === "right" && !loading && children}
    </TouchableOpacity>
  )
}

export default CustomButton
