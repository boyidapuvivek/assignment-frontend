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
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { COLORS } from "../utils/constants"

interface BusinessCardFormProps {
  initialData?: any
  onSave: (data: any, files: any) => void
  onCancel?: () => void
  showCancel?: boolean
  isCreating?: boolean
  title?: string
}

interface FormData {
  // Personal fields (mandatory marked with *)
  name: string // *
  email: string // *
  phone: string // *
  role: string // *

  // Business fields
  company: string // *
  business_description: string
  business_phone: string
  business_email: string
  website: string
  address: string
  linkedin_url: string
  twitter_url: string
  facebook_url: string
  instagram_url: string
  youtube_url: string

  // Dynamic arrays
  services: Array<{ name: string; price: number; description?: string }>
  products: Array<{ name: string; price: number; description?: string }>
}

interface ImageFiles {
  profile_image: any
  business_cover_photo: any
  business_logo: any
  gallery: any[]
}

const BusinessCardForm: React.FC<BusinessCardFormProps> = ({
  initialData = {},
  onSave,
  onCancel,
  showCancel = false,
  isCreating = false,
  title = "Create Business Card",
}) => {
  const [currentSection, setCurrentSection] = useState("Personal")

  const [formData, setFormData] = useState<FormData>({
    // Personal
    name: initialData.name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    role: initialData.role || "",

    // Business
    company: initialData.company || "",
    business_description: initialData.business_description || "",
    business_phone: initialData.business_phone || "",
    business_email: initialData.business_email || "",
    website: initialData.website || "",
    address: initialData.address || "",
    linkedin_url: initialData.linkedin_url || "",
    twitter_url: initialData.twitter_url || "",
    facebook_url: initialData.facebook_url || "",
    instagram_url: initialData.instagram_url || "",
    youtube_url: initialData.youtube_url || "",

    // Arrays
    services: initialData.services || [],
    products: initialData.products || [],
  })

  const [images, setImages] = useState({
    profile_image: initialData.profile_image || null,
    business_cover_photo: initialData.business_cover_photo || null,
    business_logo: initialData.business_logo || null,
  })

  const [imageFiles, setImageFiles] = useState<ImageFiles>({
    profile_image: null,
    business_cover_photo: null,
    business_logo: null,
    gallery: [],
  })

  const [galleryImages, setGalleryImages] = useState(initialData.gallery || [])

  const sections = ["Personal", "Business", "Services", "Products", "Gallery"]

  const updateFormData = (field: keyof FormData, value: any): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateMandatoryFields = (): boolean => {
    const { name, email, phone, role, company } = formData

    if (!name.trim()) {
      Alert.alert("Validation Error", "Name is required")
      setCurrentSection("Personal")
      return false
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Email is required")
      setCurrentSection("Personal")
      return false
    }
    if (!phone.trim()) {
      Alert.alert("Validation Error", "Phone is required")
      setCurrentSection("Personal")
      return false
    }
    if (!role.trim()) {
      Alert.alert("Validation Error", "Role is required")
      setCurrentSection("Personal")
      return false
    }
    if (!company.trim()) {
      Alert.alert("Validation Error", "Company is required")
      setCurrentSection("Business")
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Please enter a valid email address")
      setCurrentSection("Personal")
      return false
    }

    return true
  }

  // Service functions
  const addService = (): void => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: "", price: 0, description: "" }],
    }))
  }

  const updateService = (index: number, field: string, value: any): void => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }))
  }

  const removeService = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  // Product functions
  const addProduct = (): void => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { name: "", price: 0, description: "" }],
    }))
  }

  const updateProduct = (index: number, field: string, value: any): void => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      ),
    }))
  }

  const removeProduct = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }))
  }

  // Image picker functions
  const pickImage = async (
    type: "profile_image" | "business_cover_photo" | "business_logo"
  ): Promise<void> => {
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
      aspect: type === "profile_image" ? [1, 1] : [16, 9],
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
          name: asset.fileName || `${type}_${Date.now()}.jpg`,
          fileSize: asset.fileSize,
        },
      }))
    }
  }

  const pickGalleryImages = async (): Promise<void> => {
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
        name: asset.fileName || `gallery_${Date.now()}.jpg`,
        fileSize: asset.fileSize,
      }))

      const newGalleryImages = result.assets.map((asset) => asset.uri)

      setImageFiles((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newGalleryFiles],
      }))
      setGalleryImages((prev) => [...prev, ...newGalleryImages])
    }
  }

  const removeGalleryImage = (index: number): void => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (): void => {
    if (!validateMandatoryFields()) return

    const submitData = {
      ...formData,
      gallery: galleryImages,
    }

    const allImageFiles = {
      ...imageFiles,
      gallery: imageFiles.gallery,
    }

    onSave(submitData, allImageFiles)
  }

  const renderSectionTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabScrollView}
      contentContainerStyle={styles.tabContainer}>
      {sections.map((section) => (
        <TouchableOpacity
          key={section}
          style={[
            styles.tabButton,
            currentSection === section && styles.activeTabButton,
          ]}
          onPress={() => setCurrentSection(section)}>
          <Text
            style={[
              styles.tabText,
              currentSection === section && styles.activeTabText,
            ]}>
            {section}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )

  const renderPersonalSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <Text style={styles.sectionSubtitle}>
        All fields marked with * are required
      </Text>

      <View style={styles.imagePickerRow}>
        <TouchableOpacity
          onPress={() => pickImage("profile_image")}
          style={styles.imagePickerContainer}>
          {images.profile_image ? (
            <Image
              source={{ uri: images.profile_image }}
              style={styles.profileImagePreview}
            />
          ) : (
            <View
              style={[styles.imagePlaceholder, styles.profileImagePlaceholder]}>
              <Ionicons
                name='person'
                size={32}
                color='#999'
              />
              <Text style={styles.imagePlaceholderText}>Profile Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='person'
          size={20}
          color='#666'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='Full Name *'
          value={formData.name}
          onChangeText={(value) => updateFormData("name", value)}
          autoCapitalize='words'
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
          placeholder='Email Address *'
          value={formData.email}
          onChangeText={(value) => updateFormData("email", value)}
          keyboardType='email-address'
          autoCapitalize='none'
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
          placeholder='Phone Number *'
          value={formData.phone}
          onChangeText={(value) => updateFormData("phone", value)}
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
          style={styles.input}
          placeholder='Job Role/Position *'
          value={formData.role}
          onChangeText={(value) => updateFormData("role", value)}
          autoCapitalize='words'
        />
      </View>
    </View>
  )

  const renderBusinessSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Business Information</Text>

      <View style={styles.imagePickerRow}>
        <TouchableOpacity
          onPress={() => pickImage("business_cover_photo")}
          style={styles.imagePickerContainer}>
          {images.business_cover_photo ? (
            <Image
              source={{ uri: images.business_cover_photo }}
              style={styles.coverImagePreview}
            />
          ) : (
            <View
              style={[styles.imagePlaceholder, styles.coverImagePlaceholder]}>
              <Ionicons
                name='image'
                size={32}
                color='#999'
              />
              <Text style={styles.imagePlaceholderText}>Cover Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => pickImage("business_logo")}
          style={styles.imagePickerContainer}>
          {images.business_logo ? (
            <Image
              source={{ uri: images.business_logo }}
              style={styles.logoImagePreview}
            />
          ) : (
            <View
              style={[styles.imagePlaceholder, styles.logoImagePlaceholder]}>
              <Ionicons
                name='business'
                size={32}
                color='#999'
              />
              <Text style={styles.imagePlaceholderText}>Business Logo</Text>
            </View>
          )}
        </TouchableOpacity>
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
          placeholder='Company Name *'
          value={formData.company}
          onChangeText={(value) => updateFormData("company", value)}
          autoCapitalize='words'
        />
      </View>

      <View style={styles.textAreaContainer}>
        <Ionicons
          name='document-text'
          size={20}
          color='#666'
          style={styles.textAreaIcon}
        />
        <TextInput
          style={styles.textArea}
          placeholder='Business Description'
          value={formData.business_description}
          onChangeText={(value) =>
            updateFormData("business_description", value)
          }
          multiline
          numberOfLines={4}
          textAlignVertical='top'
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
          value={formData.business_phone}
          onChangeText={(value) => updateFormData("business_phone", value)}
          keyboardType='phone-pad'
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
          value={formData.business_email}
          onChangeText={(value) => updateFormData("business_email", value)}
          keyboardType='email-address'
          autoCapitalize='none'
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='globe'
          size={20}
          color='#666'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='Website URL'
          value={formData.website}
          onChangeText={(value) => updateFormData("website", value)}
          autoCapitalize='none'
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
          placeholder='Business Address'
          value={formData.address}
          onChangeText={(value) => updateFormData("address", value)}
        />
      </View>

      <Text style={styles.subSectionTitle}>Social Media Links</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name='logo-linkedin'
          size={20}
          color='#0077B5'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='LinkedIn URL'
          value={formData.linkedin_url}
          onChangeText={(value) => updateFormData("linkedin_url", value)}
          autoCapitalize='none'
        />
      </View>

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
          value={formData.facebook_url}
          onChangeText={(value) => updateFormData("facebook_url", value)}
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
          value={formData.twitter_url}
          onChangeText={(value) => updateFormData("twitter_url", value)}
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
          value={formData.instagram_url}
          onChangeText={(value) => updateFormData("instagram_url", value)}
          autoCapitalize='none'
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='logo-youtube'
          size={20}
          color='#FF0000'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='YouTube URL'
          value={formData.youtube_url}
          onChangeText={(value) => updateFormData("youtube_url", value)}
          autoCapitalize='none'
        />
      </View>
    </View>
  )

  const renderServicesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Services</Text>
        <TouchableOpacity
          onPress={addService}
          style={styles.addButton}>
          <Ionicons
            name='add'
            size={16}
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
                size={18}
                color='#ff4444'
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name='construct'
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
              name='cash'
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

          <View style={styles.textAreaContainer}>
            <Ionicons
              name='document-text'
              size={20}
              color='#666'
              style={styles.textAreaIcon}
            />
            <TextInput
              style={styles.textArea}
              placeholder='Service Description (Optional)'
              value={service.description || ""}
              onChangeText={(value) =>
                updateService(index, "description", value)
              }
              multiline
              numberOfLines={3}
              textAlignVertical='top'
            />
          </View>
        </View>
      ))}

      {formData.services.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name='construct'
            size={48}
            color='#ccc'
          />
          <Text style={styles.emptyStateText}>No services added yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap "Add Service" to get started
          </Text>
        </View>
      )}
    </View>
  )

  const renderProductsSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Products</Text>
        <TouchableOpacity
          onPress={addProduct}
          style={styles.addButton}>
          <Ionicons
            name='add'
            size={16}
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
                size={18}
                color='#ff4444'
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name='cube'
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
              name='cash'
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

          <View style={styles.textAreaContainer}>
            <Ionicons
              name='document-text'
              size={20}
              color='#666'
              style={styles.textAreaIcon}
            />
            <TextInput
              style={styles.textArea}
              placeholder='Product Description (Optional)'
              value={product.description || ""}
              onChangeText={(value) =>
                updateProduct(index, "description", value)
              }
              multiline
              numberOfLines={3}
              textAlignVertical='top'
            />
          </View>
        </View>
      ))}

      {formData.products.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name='cube'
            size={48}
            color='#ccc'
          />
          <Text style={styles.emptyStateText}>No products added yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Tap "Add Product" to get started
          </Text>
        </View>
      )}
    </View>
  )

  const renderGallerySection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Gallery</Text>
        <TouchableOpacity
          onPress={pickGalleryImages}
          style={styles.addButton}>
          <Ionicons
            name='add'
            size={16}
            color='#007BFF'
          />
          <Text style={styles.addButtonText}>Add Images</Text>
        </TouchableOpacity>
      </View>

      {galleryImages.length > 0 ? (
        <View style={styles.galleryGrid}>
          {galleryImages.map((imageUri, index) => (
            <View
              key={index}
              style={styles.galleryItem}>
              <Image
                source={{ uri: imageUri }}
                style={styles.galleryImage}
              />
              <TouchableOpacity
                onPress={() => removeGalleryImage(index)}
                style={styles.removeImageButton}>
                <Ionicons
                  name='close'
                  size={12}
                  color='#fff'
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyGallery}>
          <Ionicons
            name='images'
            size={48}
            color='#ccc'
          />
          <Text style={styles.emptyGalleryText}>
            No images added to gallery
          </Text>
          <Text style={styles.emptyStateSubtext}>
            Add images to showcase your work
          </Text>
        </View>
      )}
    </View>
  )

  const renderCurrentSection = () => {
    switch (currentSection) {
      case "Personal":
        return renderPersonalSection()
      case "Business":
        return renderBusinessSection()
      case "Services":
        return renderServicesSection()
      case "Products":
        return renderProductsSection()
      case "Gallery":
        return renderGallerySection()
      default:
        return renderPersonalSection()
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}>
        {renderSectionTabs()}
        {/* Main Container */}
        <View style={styles.mainContainer}>
          <ScrollView
            style={styles.formContent}
            showsVerticalScrollIndicator={false}>
            {renderCurrentSection()}
          </ScrollView>
          <View style={styles.buttonContainer}>
            {showCancel && (
              <TouchableOpacity
                onPress={onCancel}
                style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default BusinessCardForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#1a1a1a",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Tab Styles
  tabScrollView: {
    maxHeight: 50,
    marginBottom: 20,
  },
  tabContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: "#f8f9fa",
    minWidth: 80,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#007BFF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },

  // Form Content
  formContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Section Styles
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontStyle: "italic",
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  // Input Styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    minHeight: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 0,
  },
  textAreaContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    padding: 15,
    backgroundColor: "#f8f9fa",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  textAreaIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  textArea: {
    flex: 1,
    minHeight: 80,
    fontSize: 16,
    color: "#333",
    textAlignVertical: "top",
  },

  // Image Picker Styles
  imagePickerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 25,
    flexWrap: "wrap",
  },
  imagePickerContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  imagePlaceholder: {
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  coverImagePlaceholder: {
    width: 140,
    height: 80,
    borderRadius: 12,
  },
  logoImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  profileImagePreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  coverImagePreview: {
    width: 140,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  logoImagePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007BFF",
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },

  // Item Container (Services/Products)
  itemContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#007BFF",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  // Button Styles
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#e3f2fd",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007BFF",
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ffebee",
  },

  // Gallery Styles
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  galleryItem: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 15,
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty States
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
  },
  emptyStateText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptyStateSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  emptyGallery: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    borderWidth: 2,
    borderColor: "#e1e5e9",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
  },
  emptyGalleryText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },

  // Bottom Button Container
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 30,
    backgroundColor: "#fff",
  },
  saveButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 100,
    backgroundColor: "#3abf59ff",
    borderRadius: 18,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
  },
  cancelButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "500",
  },
})
