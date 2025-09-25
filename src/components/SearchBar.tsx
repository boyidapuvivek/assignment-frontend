// components/SearchBar.tsx
import React from "react"
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@utils/constants"

interface SearchBarProps {
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  onClear?: () => void
  style?: any
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  onClear,
  style,
}) => {
  const handleClear = () => {
    onChangeText("")
    if (onClear) onClear()
    Keyboard.dismiss()
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Ionicons
          name='search'
          size={20}
          color='#9CA3AF'
          style={styles.searchIcon}
        />

        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor='#9CA3AF'
          value={value}
          onChangeText={onChangeText}
          returnKeyType='search'
          onSubmitEditing={Keyboard.dismiss}
          autoCapitalize='none'
          autoCorrect={false}
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name='close-circle'
              size={20}
              color='#9CA3AF'
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 0,
  },
  clearButton: {
    marginLeft: 8,
  },
})
