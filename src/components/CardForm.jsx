import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

export default function CardForm({
  initialData = {},
  onSave,
  onCancel,
  showCancel = false,
  isCreating = false,
  title = "Edit Card",
}) {
  const [formData, setFormData] = useState({
    phoneNumber: initialData.phoneNumber || "",
    businessEmail: initialData.businessEmail || "",
    businessNumber: initialData.businessNumber || "",
    businessDescription: initialData.businessDescription || "",
    location: initialData.location || "",
    businessName: initialData.businessName || "",
  })

  const [createData, setCreateData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [images, setImages] = useState({
    avatar: initialData.avatar?.url || null,
    coverImage: initialData.coverImage?.url || null,
  })

  const [imageFiles, setImageFiles] = useState({
    avatar: null,
    coverImage: null,
  })

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateCreateData = (field, value) => {
    setCreateData((prev) => ({ ...prev, [field]: value }))
  }

  // Update the pickImage function in CardForm.jsx:

  const pickImage = async (type) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to upload images."
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: type === "avatar" ? [1, 1] : [16, 9],
      quality: 0.7, // Reduced quality to avoid large files
      allowsMultipleSelection: false,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      setImages((prev) => ({ ...prev, [type]: asset.uri }))

      // Store the complete asset info for upload
      setImageFiles((prev) => ({
        ...prev,
        [type]: {
          uri: asset.uri,
          type: asset.type || "image/jpeg",
          fileName: asset.fileName || `${type}_${Date.now()}.jpg`,
          fileSize: asset.fileSize,
          width: asset.width,
          height: asset.height,
        },
      }))
    }
  }

  const removeImage = (type) => {
    setImages((prev) => ({ ...prev, [type]: null }))
    setImageFiles((prev) => ({ ...prev, [type]: null }))
  }

  const handleSubmit = () => {
    if (isCreating) {
      if (!createData.username || !createData.email || !createData.password) {
        Alert.alert("Error", "Username, email, and password are required")
        return
      }
    }

    const submitData = isCreating ? { ...createData, ...formData } : formData
    onSave(submitData, imageFiles)
  }

  const renderImagePicker = (type, label, aspectRatio) => (
    <View style={styles.imageSection}>
      <Text style={styles.sectionSubtitle}>{label}</Text>
      <View style={styles.imageContainer}>
        {images[type] ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: images[type] }}
              style={[
                styles.imagePreview,
                type === "avatar" ? styles.avatarPreview : styles.coverPreview,
              ]}
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => removeImage(type)}>
              <Ionicons
                name='close-circle'
                size={24}
                color='#ff4444'
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.imagePlaceholder,
              type === "avatar"
                ? styles.avatarPlaceholder
                : styles.coverPlaceholder,
            ]}
            onPress={() => pickImage(type)}>
            <Ionicons
              name={type === "avatar" ? "person-add" : "image"}
              size={type === "avatar" ? 40 : 50}
              color='#999'
            />
            <Text style={styles.imagePlaceholderText}>
              {type === "avatar" ? "Add Profile Photo" : "Add Cover Image"}
            </Text>
          </TouchableOpacity>
        )}
        {images[type] && (
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={() => pickImage(type)}>
            <MaterialIcons
              name='edit'
              size={16}
              color='#007BFF'
            />
            <Text style={styles.changeImageText}>Change</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{title}</Text>

      {/* Images Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MaterialIcons
            name='photo-camera'
            size={20}
            color='#007BFF'
          />{" "}
          Profile Images
        </Text>
        {renderImagePicker("avatar", "Profile Photo", [1, 1])}
        {renderImagePicker("coverImage", "Cover Image", [16, 9])}
      </View>

      {/* Account Details Section (Only for creating) */}
      {isCreating && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MaterialIcons
              name='account-circle'
              size={20}
              color='#007BFF'
            />{" "}
            Account Details
          </Text>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name='person'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Username'
              value={createData.username}
              onChangeText={(value) => updateCreateData("username", value)}
              autoCapitalize='none'
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name='email'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Email'
              value={createData.email}
              onChangeText={(value) => updateCreateData("email", value)}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name='lock'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Password'
              value={createData.password}
              onChangeText={(value) => updateCreateData("password", value)}
              secureTextEntry
            />
          </View>
        </View>
      )}

      {/* Personal Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MaterialIcons
            name='phone'
            size={20}
            color='#007BFF'
          />{" "}
          Personal Contact
        </Text>
        <View style={styles.inputContainer}>
          <MaterialIcons
            name='phone'
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
          <MaterialIcons
            name='location-on'
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
      </View>

      {/* Business Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MaterialIcons
            name='business'
            size={20}
            color='#007BFF'
          />{" "}
          Business Contact
        </Text>
        <View style={styles.inputContainer}>
          <MaterialIcons
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
        <View style={styles.inputContainer}>
          <MaterialIcons
            name='email'
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
          <MaterialIcons
            name='phone'
            size={20}
            color='#666'
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder='Business Phone'
            value={formData.businessNumber}
            onChangeText={(value) => updateFormData("businessNumber", value)}
            keyboardType='phone-pad'
          />
        </View>
      </View>

      {/* Business Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MaterialIcons
            name='description'
            size={20}
            color='#007BFF'
          />{" "}
          Business Description
        </Text>
        <View style={styles.textAreaContainer}>
          <MaterialIcons
            name='description'
            size={20}
            color='#666'
            style={styles.textAreaIcon}
          />
          <TextInput
            style={styles.textArea}
            placeholder='Describe your business or services...'
            value={formData.businessDescription}
            onChangeText={(value) =>
              updateFormData("businessDescription", value)
            }
            multiline
            numberOfLines={4}
            textAlignVertical='top'
          />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit}>
          <MaterialIcons
            name='save'
            size={20}
            color='#fff'
          />
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {showCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
    color: "#1a1a1a",
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
    flexDirection: "row",
    alignItems: "center",
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
    color: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  textAreaContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#f8f9fa",
    alignItems: "flex-start",
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    minHeight: 100,
    fontSize: 16,
    color: "#333",
  },
  imageSection: {
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageWrapper: {
    position: "relative",
  },
  imagePreview: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e1e5e9",
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  coverPreview: {
    width: 280,
    height: 160,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  imagePlaceholder: {
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  coverPlaceholder: {
    width: 280,
    height: 160,
    borderRadius: 12,
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f0f8ff",
    borderRadius: 16,
  },
  changeImageText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  saveButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "500",
  },
})
