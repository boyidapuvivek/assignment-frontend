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

interface CardFormProps {
  initialData?: any
  onSave: (data: any, files: any) => void
  onCancel?: () => void
  showCancel?: boolean
  isCreating?: boolean
  title?: string
}

interface FormData {
  phoneNumber: string
  businessEmail: string
  businessNumber: string
  businessDescription: string
  location: string
  businessName: string
}

interface CreateData {
  username: string
  email: string
}

interface Images {
  avatar: string | null
  coverImage: string | null
}

interface ImageFiles {
  avatar: any
  coverImage: any
}

const CardForm: React.FC<CardFormProps> = ({
  initialData = {},
  onSave,
  onCancel,
  showCancel = false,
  isCreating = false,
  title = "Edit Card",
}) => {
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: initialData?.phoneNumber || "",
    businessEmail: initialData?.businessEmail || "",
    businessNumber: initialData?.businessNumber || "",
    businessDescription: initialData?.businessDescription || "",
    location: initialData?.location || "",
    businessName: initialData?.businessName || "",
  })

  const [createData, setCreateData] = useState<CreateData>({
    username: "",
    email: "",
  })

  const [images, setImages] = useState<Images>({
    avatar: initialData?.avatar?.url || "",
    coverImage: initialData?.coverImage?.url || "",
  })

  const [imageFiles, setImageFiles] = useState<ImageFiles>({
    avatar: null,
    coverImage: null,
  })

  const updateFormData = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const updateCreateData = (field: keyof CreateData, value: string): void => {
    setCreateData((prev) => ({ ...prev, [field]: value }))
  }

  const pickImage = async (type: "avatar" | "coverImage"): Promise<void> => {
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
      quality: 0.7,
      allowsMultipleSelection: false,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      setImages((prev) => ({ ...prev, [type]: asset.uri }))
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

  const removeImage = (type: "avatar" | "coverImage"): void => {
    setImages((prev) => ({ ...prev, [type]: null }))
    setImageFiles((prev) => ({ ...prev, [type]: null }))
  }

  const handleSubmit = (): void => {
    if (isCreating) {
      if (!createData.username || !createData.email) {
        Alert.alert("Error", "Username and email are required")
        return
      }
    }

    const submitData = isCreating ? { ...createData, ...formData } : formData
    onSave(submitData, imageFiles)
  }

  const renderImagePicker = (
    type: "avatar" | "coverImage",
    label: string,
    aspectRatio: number[]
  ): JSX.Element => (
    <View style={styles.imageContainer}>
      <Text style={styles.sectionSubtitle}>{label}</Text>
      {images[type] ? (
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: images[type]! }}
            style={[
              styles.imagePreview,
              type === "avatar" ? styles.avatarPreview : styles.coverPreview,
            ]}
            resizeMode='cover'
          />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => removeImage(type)}>
            <Ionicons
              name='close'
              size={16}
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
            name='camera'
            size={30}
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
          <Ionicons
            name='camera'
            size={16}
            color='#007BFF'
          />
          <Text style={styles.changeImageText}>Change</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Images Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons
            name='images'
            size={20}
            color='#333'
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
            <Ionicons
              name='person-add'
              size={20}
              color='#333'
            />{" "}
            Account Details
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
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
            <Ionicons
              name='mail'
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
        </View>
      )}

      {/* Personal Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons
            name='person'
            size={20}
            color='#333'
          />{" "}
          Personal Contact
        </Text>

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
      </View>

      {/* Business Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <Ionicons
            name='business'
            size={20}
            color='#333'
          />{" "}
          Business Contact
        </Text>

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

        <View style={styles.inputContainer}>
          <Ionicons
            name='mail'
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
            name='call'
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
          <Ionicons
            name='document-text'
            size={20}
            color='#333'
          />{" "}
          Business Description
        </Text>

        <View style={styles.textAreaContainer}>
          <Ionicons
            name='document-text'
            size={20}
            color='#666'
            style={styles.textAreaIcon}
          />
          <TextInput
            style={styles.textArea}
            placeholder='Describe your business...'
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
          <Ionicons
            name='checkmark'
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

export default CardForm

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
