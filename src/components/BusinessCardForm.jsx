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
  FlatList,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

export default function BusinessCardForm({
  initialData = {},
  onSave,
  onCancel,
  showCancel = false,
  isCreating = false,
  title = "Create Business Card",
}) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Account Details
    username: "",
    email: "",

    // Contact Information
    phoneNumber: initialData.phoneNumber || "",
    businessEmail: initialData.businessEmail || "",
    businessNumber: initialData.businessNumber || "",
    businessDescription: initialData.businessDescription || "",
    location: initialData.location || "",
    businessName: initialData.businessName || "",

    // Social Media Links
    socialMediaLinks: [
      {
        facebook: initialData.socialMediaLinks?.facebook || "",
        twitter: initialData.socialMediaLinks?.twitter || "",
        linkedIn: initialData.socialMediaLinks?.linkedIn || "",
        instagram: initialData.socialMediaLinks?.instagram || "",
      },
    ],

    // Services and Products
    services: initialData.services || [],
    products: initialData.products || [],
  })

  const [images, setImages] = useState({
    avatar: initialData.avatar?.url || null,
    coverImage: initialData.coverImage?.url || null,
  })

  const [imageFiles, setImageFiles] = useState({
    avatar: null,
    coverImage: null,
    gallery: [],
  })

  const [galleryImages, setGalleryImages] = useState(initialData.gallery || [])

  const steps = ["Contact Info", "Services & Products", "Gallery & Images"]

  const updateFormData = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: "", price: 0 }],
    }))
  }

  const updateService = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }))
  }

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { name: "", price: 0 }],
    }))
  }

  const updateProduct = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      ),
    }))
  }

  const removeProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }))
  }

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

  const pickGalleryImages = async () => {
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
      allowsEditing: false,
      quality: 0.7,
      allowsMultipleSelection: true,
    })

    if (!result.canceled) {
      const newGalleryFiles = result.assets.map((asset) => ({
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        fileName: asset.fileName || `gallery_${Date.now()}.jpg`,
        fileSize: asset.fileSize,
        width: asset.width,
        height: asset.height,
      }))

      const newGalleryImages = result.assets.map((asset) => ({
        url: asset.uri,
        public_id: `temp_${Date.now()}_${Math.random()}`,
      }))

      setImageFiles((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newGalleryFiles],
      }))

      setGalleryImages((prev) => [...prev, ...newGalleryImages])
    }
  }

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (isCreating && (!formData.username || !formData.email)) {
          Alert.alert("Error", "Username and email are required")
          return false
        }
        return true
      case 1:
        return true // Services and products are optional
      case 2:
        return true // Gallery is optional
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = () => {
    if (!validateStep()) return

    const submitData = {
      ...formData,
      gallery: galleryImages[0],
    }

    const allImageFiles = {
      ...imageFiles,
      gallery: imageFiles.gallery[0],
    }

    onSave(submitData, allImageFiles)
  }

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View
          key={index}
          style={styles.stepItem}>
          <View
            style={[
              styles.stepCircle,
              index <= currentStep && styles.stepCircleActive,
            ]}>
            <Text
              style={[
                styles.stepNumber,
                index <= currentStep && styles.stepNumberActive,
              ]}>
              {index + 1}
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              index <= currentStep && styles.stepLabelActive,
            ]}>
            {step}
          </Text>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepLine,
                index < currentStep && styles.stepLineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  )

  const renderContactForm = () => (
    <ScrollView style={styles.stepContent}>
      {isCreating && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name='person-outline'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Username'
              value={formData.username}
              onChangeText={(value) => updateFormData("username", value)}
              autoCapitalize='none'
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
              placeholder='Email'
              value={formData.email}
              onChangeText={(value) => updateFormData("email", value)}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Images</Text>
        <View style={styles.imageRow}>
          <TouchableOpacity
            onPress={() => pickImage("avatar")}
            style={styles.imagePickerContainer}>
            {images.avatar ? (
              <Image
                source={{ uri: images.avatar }}
                style={styles.avatarPreview}
              />
            ) : (
              <View style={[styles.imagePlaceholder, styles.avatarPlaceholder]}>
                <Ionicons
                  name='person-add'
                  size={30}
                  color='#999'
                />
                <Text style={styles.imagePlaceholderText}>Profile Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => pickImage("coverImage")}
            style={styles.imagePickerContainer}>
            {images.coverImage ? (
              <Image
                source={{ uri: images.coverImage }}
                style={styles.coverPreview}
              />
            ) : (
              <View style={[styles.imagePlaceholder, styles.coverPlaceholder]}>
                <Ionicons
                  name='image'
                  size={30}
                  color='#999'
                />
                <Text style={styles.imagePlaceholderText}>Cover Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Business Information</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name='business-outline'
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
            name='call-outline'
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
            name='location-outline'
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
        <View style={styles.textAreaContainer}>
          <Ionicons
            name='document-text-outline'
            size={20}
            color='#666'
            style={styles.textAreaIcon}
          />
          <TextInput
            style={styles.textArea}
            placeholder='Business Description'
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social Media Links</Text>
        <View style={styles.inputContainer}>
          <Ionicons
            name='logo-facebook'
            size={20}
            color='#1877F2'
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder='Facebook URL'
            value={formData.socialMediaLinks[0].facebook}
            onChangeText={(value) =>
              updateFormData("socialMediaLinks.facebook", value)
            }
            autoCapitalize='none'
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name='logo-twitter'
            size={20}
            color='#1DA1F2'
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder='Twitter URL'
            value={formData.socialMediaLinks[0].twitter}
            onChangeText={(value) =>
              updateFormData("socialMediaLinks.twitter", value)
            }
            autoCapitalize='none'
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name='logo-linkedin'
            size={20}
            color='#0A66C2'
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder='LinkedIn URL'
            value={formData.socialMediaLinks[0].linkedIn}
            onChangeText={(value) =>
              updateFormData("socialMediaLinks.linkedIn", value)
            }
            autoCapitalize='none'
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons
            name='logo-instagram'
            size={20}
            color='#E4405F'
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder='Instagram URL'
            value={formData.socialMediaLinks[0].instagram}
            onChangeText={(value) =>
              updateFormData("socialMediaLinks.instagram", value)
            }
            autoCapitalize='none'
          />
        </View>
      </View>
    </ScrollView>
  )

  const renderServicesProducts = () => (
    <ScrollView style={styles.stepContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
          <TouchableOpacity
            onPress={addService}
            style={styles.addButton}>
            <Ionicons
              name='add'
              size={20}
              color='#007BFF'
            />
            <Text style={styles.addButtonText}>Add Service</Text>
          </TouchableOpacity>
        </View>

        {formData.services.map((service, index) => (
          <View
            key={index}
            style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>Service {index + 1}</Text>
              <TouchableOpacity
                onPress={() => removeService(index)}
                style={styles.removeButton}>
                <Ionicons
                  name='trash'
                  size={16}
                  color='#ff4444'
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                name='construct-outline'
                size={20}
                color='#666'
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Service Name'
                value={service.name}
                onChangeText={(value) => updateService(index, "name", value)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                name='pricetag-outline'
                size={20}
                color='#666'
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Price'
                value={service.price.toString()}
                onChangeText={(value) =>
                  updateService(index, "price", parseFloat(value) || 0)
                }
                keyboardType='numeric'
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <TouchableOpacity
            onPress={addProduct}
            style={styles.addButton}>
            <Ionicons
              name='add'
              size={20}
              color='#007BFF'
            />
            <Text style={styles.addButtonText}>Add Product</Text>
          </TouchableOpacity>
        </View>

        {formData.products.map((product, index) => (
          <View
            key={index}
            style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>Product {index + 1}</Text>
              <TouchableOpacity
                onPress={() => removeProduct(index)}
                style={styles.removeButton}>
                <Ionicons
                  name='trash'
                  size={16}
                  color='#ff4444'
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                name='cube-outline'
                size={20}
                color='#666'
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Product Name'
                value={product.name}
                onChangeText={(value) => updateProduct(index, "name", value)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Ionicons
                name='pricetag-outline'
                size={20}
                color='#666'
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder='Price'
                value={product.price.toString()}
                onChangeText={(value) =>
                  updateProduct(index, "price", parseFloat(value) || 0)
                }
                keyboardType='numeric'
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )

  const renderGallery = () => (
    <ScrollView style={styles.stepContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gallery Images</Text>
          <TouchableOpacity
            onPress={pickGalleryImages}
            style={styles.addButton}>
            <Ionicons
              name='images'
              size={20}
              color='#007BFF'
            />
            <Text style={styles.addButtonText}>Add Images</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.galleryGrid}>
          {galleryImages.map((image, index) => (
            <View
              key={index}
              style={styles.galleryItem}>
              <Image
                source={{ uri: image.url }}
                style={styles.galleryImage}
              />
              <TouchableOpacity
                onPress={() => removeGalleryImage(index)}
                style={styles.removeImageButton}>
                <Ionicons
                  name='close'
                  size={16}
                  color='#fff'
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {galleryImages.length === 0 && (
          <TouchableOpacity
            onPress={pickGalleryImages}
            style={styles.emptyGallery}>
            <Ionicons
              name='images'
              size={40}
              color='#999'
            />
            <Text style={styles.emptyGalleryText}>
              Add gallery images to showcase your work
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderContactForm()
      case 1:
        return renderServicesProducts()
      case 2:
        return renderGallery()
      default:
        return renderContactForm()
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {renderStepIndicator()}

      {renderCurrentStep()}

      <View style={styles.buttonContainer}>
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <TouchableOpacity
              onPress={prevStep}
              style={styles.prevButton}>
              <Ionicons
                name='chevron-back'
                size={20}
                color='#007BFF'
              />
              <Text style={styles.prevButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          {currentStep < steps.length - 1 ? (
            <TouchableOpacity
              onPress={nextStep}
              style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next</Text>
              <Ionicons
                name='chevron-forward'
                size={20}
                color='#fff'
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.saveButton}>
              <Ionicons
                name='checkmark'
                size={20}
                color='#fff'
              />
              <Text style={styles.saveButtonText}>Save Business Card</Text>
            </TouchableOpacity>
          )}
        </View>

        {showCancel && (
          <TouchableOpacity
            onPress={onCancel}
            style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
    marginBottom: 20,
    textAlign: "center",
    color: "#1a1a1a",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#e1e5e9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: "#007BFF",
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    // maxWidth: 80,
    overflow: "hidden",
    // height: 20,
  },
  stepLabelActive: {
    color: "#007BFF",
    fontWeight: "600",
  },
  stepLine: {
    position: "absolute",
    top: 15,
    left: "60%",
    right: "-40%",
    height: 2,
    backgroundColor: "#e1e5e9",
  },
  stepLineActive: {
    backgroundColor: "#007BFF",
  },
  stepContent: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f0f8ff",
    borderRadius: 16,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "500",
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
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  imagePickerContainer: {
    alignItems: "center",
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
    width: 160,
    height: 90,
    borderRadius: 12,
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#e1e5e9",
  },
  coverPreview: {
    width: 160,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e1e5e9",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  itemContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  removeButton: {
    padding: 5,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  galleryItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 10,
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyGallery: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
  },
  emptyGalleryText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  prevButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
  },
  prevButtonText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "500",
  },
  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 12,
  },
  nextButtonText: {
    marginRight: 5,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    backgroundColor: "#28a745",
    borderRadius: 12,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "500",
  },
})
