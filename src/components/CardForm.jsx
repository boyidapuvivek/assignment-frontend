import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function CardForm({
  initialData = {},
  onSave,
  onCancel,
  showCancel = false,
  isCreating = false,
  title = "Edit Card",
}) {
  const [formData, setFormData] = useState({
    // username: initialData.username || "",
    // email: initialData.email || "",
    // password: "",
    phoneNumber: initialData.phoneNumber || "",
    businessEmail: initialData.businessEmail || "",
    businessNumber: initialData.businessNumber || "",
    businessDescription: initialData.businessDescription || "",
    location: initialData.location || "",
    businessName: initialData.businessName || "",
  })

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    if (isCreating) {
      if (!formData.username || !formData.email || !formData.password) {
        Alert.alert("Error", "Username, email, and password are required")
        return
      }
    }
    onSave(formData)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {isCreating && (
        <>
          <View style={styles.inputContainer}>
            <Ionicons
              name='person'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Username *'
              value={formData.username}
              onChangeText={(value) => updateFormData("username", value)}
              autoCapitalize='none'
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name='mail'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Email *'
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name='lock-closed'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Password *'
              value={formData.password}
              onChangeText={(value) => updateFormData("password", value)}
              secureTextEntry
            />
          </View>
        </>
      )}

      <View style={styles.inputContainer}>
        <Ionicons
          name='call'
          size={20}
          color='#666'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='Phone Number'
          value={formData.phoneNumber}
          onChangeText={(value) => updateFormData("phoneNumber", value)}
          keyboardType='phone-pad'
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='mail-outline'
          size={20}
          color='#666'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='Business Email'
          value={formData.businessEmail}
          onChangeText={(value) => updateFormData("businessEmail", value)}
          keyboardType='email-address'
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='call-outline'
          size={20}
          color='#666'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='Business Number'
          value={formData.businessNumber}
          onChangeText={(value) => updateFormData("businessNumber", value)}
          keyboardType='phone-pad'
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='briefcase'
          size={20}
          color='#666'
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder='Business Description'
          value={formData.businessDescription}
          onChangeText={(value) => updateFormData("businessDescription", value)}
          multiline
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='location'
          size={20}
          color='#666'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='Location'
          value={formData.location}
          onChangeText={(value) => updateFormData("location", value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='business'
          size={20}
          color='#666'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='Business Name'
          value={formData.businessName}
          onChangeText={(value) => updateFormData("businessName", value)}
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSubmit}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      {showCancel && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "red",
    fontSize: 16,
  },
})
