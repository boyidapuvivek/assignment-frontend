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
  Dimensions,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { COLORS } from "@utils/constants"

const { width: screenWidth } = Dimensions.get("window")

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
  const [currentStep, setCurrentStep] = useState(0)

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

  const sections = [
    { key: "Personal", title: "Personal", icon: "person" },
    { key: "Business", title: "Business", icon: "business" },
    { key: "Services", title: "Services", icon: "construct" },
    { key: "Products", title: "Products", icon: "cube" },
    { key: "Gallery", title: "Gallery", icon: "images" },
  ]

  const updateFormData = (field: keyof FormData, value: any): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 0: // Personal
        const { name, email, phone, role } = formData

        if (!name.trim()) {
          Alert.alert("Validation Error", "Name is required")
          return false
        }
        if (!email.trim()) {
          Alert.alert("Validation Error", "Email is required")
          return false
        }
        if (!phone.trim()) {
          Alert.alert("Validation Error", "Phone is required")
          return false
        }
        if (!role.trim()) {
          Alert.alert("Validation Error", "Role is required")
          return false
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          Alert.alert("Validation Error", "Please enter a valid email address")
          return false
        }
        return true

      case 1: // Business
        const { company } = formData
        if (!company.trim()) {
          Alert.alert("Validation Error", "Company is required")
          return false
        }
        return true

      case 2: // Services - Optional
      case 3: // Products - Optional
      case 4: // Gallery - Optional
        return true

      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < sections.length - 1) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (): void => {
    if (!validateCurrentStep()) return

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

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {sections.map((section, index) => (
          <React.Fragment key={section.key}>
            <View
              style={[
                styles.progressStep,
                index <= currentStep
                  ? styles.activeProgressStep
                  : styles.inactiveProgressStep,
              ]}>
              <View
                style={[
                  styles.stepCircle,
                  index <= currentStep
                    ? styles.activeStepCircle
                    : styles.inactiveStepCircle,
                ]}>
                {index < currentStep ? (
                  <Ionicons
                    name='checkmark'
                    size={12}
                    color='#fff'
                  />
                ) : (
                  <Text
                    style={[
                      styles.stepNumber,
                      index <= currentStep
                        ? styles.activeStepNumber
                        : styles.inactiveStepNumber,
                    ]}>
                    {index + 1}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  index <= currentStep
                    ? styles.activeStepLabel
                    : styles.inactiveStepLabel,
                ]}>
                {section.title}
              </Text>
            </View>
            {index < sections.length - 1 && (
              <View
                style={[
                  styles.progressLine,
                  index < currentStep
                    ? styles.activeProgressLine
                    : styles.inactiveProgressLine,
                ]}
              />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  )

  const renderPersonalSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons
          name='person'
          size={24}
          color='#007BFF'
        />
        <Text style={styles.sectionTitle}>Personal Information</Text>
      </View>

      <View style={styles.imageSection}>
        <TouchableOpacity
          onPress={() => pickImage("profile_image")}
          style={styles.profileImageContainer}>
          {images.profile_image ? (
            <Image
              source={{ uri: images.profile_image }}
              style={styles.profileImagePreview}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons
                name='person'
                size={32}
                color='#999'
              />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='person-outline'
          size={20}
          color='#007BFF'
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
          name='mail-outline'
          size={20}
          color='#007BFF'
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
          name='call-outline'
          size={20}
          color='#007BFF'
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
          name='briefcase-outline'
          size={20}
          color='#007BFF'
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
      <View style={styles.sectionHeader}>
        <Ionicons
          name='business'
          size={24}
          color='#007BFF'
        />
        <Text style={styles.sectionTitle}>Business Information</Text>
      </View>

      <View style={styles.businessImagesRow}>
        <TouchableOpacity
          onPress={() => pickImage("business_cover_photo")}
          style={styles.businessImageContainer}>
          {images.business_cover_photo ? (
            <Image
              source={{ uri: images.business_cover_photo }}
              style={styles.coverImagePreview}
            />
          ) : (
            <View style={styles.coverImagePlaceholder}>
              <Ionicons
                name='image-outline'
                size={24}
                color='#999'
              />
              <Text style={styles.smallImageText}>Cover</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => pickImage("business_logo")}
          style={styles.businessImageContainer}>
          {images.business_logo ? (
            <Image
              source={{ uri: images.business_logo }}
              style={styles.logoImagePreview}
            />
          ) : (
            <View style={styles.logoImagePlaceholder}>
              <Ionicons
                name='business-outline'
                size={24}
                color='#999'
              />
              <Text style={styles.smallImageText}>Logo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='business-outline'
          size={20}
          color='#007BFF'
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
          name='document-text-outline'
          size={20}
          color='#007BFF'
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
          numberOfLines={3}
          textAlignVertical='top'
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons
          name='call-outline'
          size={20}
          color='#007BFF'
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
          name='mail-outline'
          size={20}
          color='#007BFF'
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
          name='globe-outline'
          size={20}
          color='#007BFF'
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
          name='location-outline'
          size={20}
          color='#007BFF'
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder='Business Address'
          value={formData.address}
          onChangeText={(value) => updateFormData("address", value)}
        />
      </View>

      <View style={styles.socialSection}>
        <Text style={styles.subSectionTitle}>Social Media</Text>

        <View style={styles.socialRow}>
          <View style={styles.socialInput}>
            <Ionicons
              name='logo-linkedin'
              size={18}
              color='#0077B5'
              style={styles.socialIcon}
            />
            <TextInput
              style={styles.socialTextInput}
              placeholder='LinkedIn'
              value={formData.linkedin_url}
              onChangeText={(value) => updateFormData("linkedin_url", value)}
              autoCapitalize='none'
            />
          </View>

          <View style={styles.socialInput}>
            <Ionicons
              name='logo-facebook'
              size={18}
              color='#1877F2'
              style={styles.socialIcon}
            />
            <TextInput
              style={styles.socialTextInput}
              placeholder='Facebook'
              value={formData.facebook_url}
              onChangeText={(value) => updateFormData("facebook_url", value)}
              autoCapitalize='none'
            />
          </View>
        </View>

        <View style={styles.socialRow}>
          <View style={styles.socialInput}>
            <Ionicons
              name='logo-twitter'
              size={18}
              color='#1DA1F2'
              style={styles.socialIcon}
            />
            <TextInput
              style={styles.socialTextInput}
              placeholder='Twitter'
              value={formData.twitter_url}
              onChangeText={(value) => updateFormData("twitter_url", value)}
              autoCapitalize='none'
            />
          </View>

          <View style={styles.socialInput}>
            <Ionicons
              name='logo-instagram'
              size={18}
              color='#E4405F'
              style={styles.socialIcon}
            />
            <TextInput
              style={styles.socialTextInput}
              placeholder='Instagram'
              value={formData.instagram_url}
              onChangeText={(value) => updateFormData("instagram_url", value)}
              autoCapitalize='none'
            />
          </View>
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
    </View>
  )

  const renderServicesSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons
          name='construct'
          size={24}
          color='#007BFF'
        />
        <Text style={styles.sectionTitle}>Services</Text>
      </View>

      <TouchableOpacity
        onPress={addService}
        style={styles.addButton}>
        <Ionicons
          name='add-circle-outline'
          size={24}
          color='#007BFF'
        />
        <Text style={styles.addButtonText}>Add Service</Text>
      </TouchableOpacity>

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
                name='trash-outline'
                size={18}
                color='#dc3545'
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name='construct-outline'
              size={20}
              color='#007BFF'
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
              name='cash-outline'
              size={20}
              color='#007BFF'
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
              name='document-text-outline'
              size={20}
              color='#007BFF'
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
              numberOfLines={2}
              textAlignVertical='top'
            />
          </View>
        </View>
      ))}

      {formData.services.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name='construct-outline'
            size={48}
            color='#ccc'
          />
          <Text style={styles.emptyStateText}>No services added yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add services you offer to customers
          </Text>
        </View>
      )}
    </View>
  )

  const renderProductsSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons
          name='cube'
          size={24}
          color='#007BFF'
        />
        <Text style={styles.sectionTitle}>Products</Text>
      </View>

      <TouchableOpacity
        onPress={addProduct}
        style={styles.addButton}>
        <Ionicons
          name='add-circle-outline'
          size={24}
          color='#007BFF'
        />
        <Text style={styles.addButtonText}>Add Product</Text>
      </TouchableOpacity>

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
                name='trash-outline'
                size={18}
                color='#dc3545'
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons
              name='cube-outline'
              size={20}
              color='#007BFF'
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
              name='cash-outline'
              size={20}
              color='#007BFF'
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
              name='document-text-outline'
              size={20}
              color='#007BFF'
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
              numberOfLines={2}
              textAlignVertical='top'
            />
          </View>
        </View>
      ))}

      {formData.products.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons
            name='cube-outline'
            size={48}
            color='#ccc'
          />
          <Text style={styles.emptyStateText}>No products added yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add products you sell to customers
          </Text>
        </View>
      )}
    </View>
  )

  const renderGallerySection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons
          name='images'
          size={24}
          color='#007BFF'
        />
        <Text style={styles.sectionTitle}>Gallery</Text>
      </View>

      <TouchableOpacity
        onPress={pickGalleryImages}
        style={styles.addButton}>
        <Ionicons
          name='add-circle-outline'
          size={24}
          color='#007BFF'
        />
        <Text style={styles.addButtonText}>Add Images</Text>
      </TouchableOpacity>

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
            name='images-outline'
            size={48}
            color='#ccc'
          />
          <Text style={styles.emptyGalleryText}>No images yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add images to showcase your work
          </Text>
        </View>
      )}
    </View>
  )

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalSection()
      case 1:
        return renderBusinessSection()
      case 2:
        return renderServicesSection()
      case 3:
        return renderProductsSection()
      case 4:
        return renderGallerySection()
      default:
        return renderPersonalSection()
    }
  }

  const isLastStep = currentStep === sections.length - 1
  const isFirstStep = currentStep === 0

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
      {/* Compact Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.stepCounter}>
          {currentStep + 1} of {sections.length}
        </Text>
      </View>

      {/* Compact Progress Bar */}
      {renderProgressBar()}

      {/* Main Content */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'>
        <View style={styles.mainContainer}>
          {renderCurrentSection()}
          <View style={styles.bottomNavigation}>
            <View style={styles.navigationButtons}>
              {!isFirstStep && (
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={styles.previousButton}
                  activeOpacity={0.8}>
                  <Ionicons
                    name='chevron-back'
                    size={18}
                    color='#666'
                  />
                  <Text style={styles.previousButtonText}>Back</Text>
                </TouchableOpacity>
              )}

              {showCancel && isFirstStep && (
                <TouchableOpacity
                  onPress={onCancel}
                  style={styles.cancelButton}
                  activeOpacity={0.8}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}

              <View style={styles.spacer} />

              {!isLastStep ? (
                <TouchableOpacity
                  onPress={handleNext}
                  style={styles.nextButton}
                  activeOpacity={0.8}>
                  <Text style={styles.nextButtonText}>Next</Text>
                  <Ionicons
                    name='chevron-forward'
                    size={18}
                    color='#fff'
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.submitButton}
                  activeOpacity={0.8}>
                  <MaterialIcons
                    name='save'
                    size={18}
                    color='#fff'
                  />
                  <Text style={styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
    </KeyboardAvoidingView>
  )
}

export default BusinessCardForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 4,
  },

  stepCounter: {
    fontSize: 13,
    color: "#6c757d",
    textAlign: "center",
    fontWeight: "500",
  },

  // Progress Bar
  progressContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },

  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  progressStep: {
    alignItems: "center",
    flex: 5,
  },

  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  activeStepCircle: {
    backgroundColor: "#007BFF",
  },

  inactiveStepCircle: {
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#dee2e6",
  },

  stepNumber: {
    fontSize: 10,
    fontWeight: "700",
  },

  activeStepNumber: {
    color: "#fff",
  },

  inactiveStepNumber: {
    color: "#6c757d",
  },

  stepLabel: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },

  activeStepLabel: {
    color: "#007BFF",
  },

  inactiveStepLabel: {
    color: "#6c757d",
  },

  progressLine: {
    height: 2,
    flex: 1,
    marginHorizontal: 4,
    marginBottom: 18,
  },

  activeProgressLine: {
    backgroundColor: "#007BFF",
  },

  inactiveProgressLine: {
    backgroundColor: "#e9ecef",
  },

  // Main Content
  scrollContainer: {
    flex: 1,
  },

  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
  },

  // Section Styles
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginLeft: 8,
  },

  subSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    marginTop: 8,
  },

  // Image Sections
  imageSection: {
    alignItems: "center",
    marginBottom: 24,
  },

  profileImageContainer: {
    alignItems: "center",
  },

  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },

  profileImagePreview: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#007BFF",
  },

  businessImagesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  businessImageContainer: {
    alignItems: "center",
  },

  coverImagePlaceholder: {
    width: 100,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },

  logoImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },

  coverImagePreview: {
    width: 100,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007BFF",
  },

  logoImagePreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007BFF",
  },

  imagePlaceholderText: {
    marginTop: 4,
    fontSize: 10,
    color: "#6c757d",
    textAlign: "center",
    fontWeight: "500",
  },

  smallImageText: {
    marginTop: 2,
    fontSize: 9,
    color: "#6c757d",
    textAlign: "center",
  },

  // Input Styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    minHeight: 48,
    marginBottom: 12,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
    paddingVertical: 0,
  },

  textAreaContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    marginBottom: 12,
    minHeight: 70,
  },

  textAreaIcon: {
    marginRight: 10,
    marginTop: 2,
  },

  textArea: {
    flex: 1,
    fontSize: 15,
    color: "#1a1a1a",
    textAlignVertical: "top",
    minHeight: 50,
  },

  // Social Media Section
  socialSection: {
    marginTop: 16,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  socialInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    minHeight: 40,
    width: "48%",
  },

  socialIcon: {
    marginRight: 8,
  },

  socialTextInput: {
    flex: 1,
    fontSize: 14,
    color: "#1a1a1a",
    paddingVertical: 0,
  },

  // Services/Products Item Container
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
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f8f9ff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007BFF",
    borderStyle: "dashed",
    marginBottom: 20,
  },

  addButtonText: {
    marginLeft: 6,
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
    width: (screenWidth - 80) / 3, // 3 images per row
    aspectRatio: 1,
    marginBottom: 12,
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
  },

  galleryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(220, 53, 69, 0.9)",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty States
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
  },

  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "600",
  },

  emptyStateSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: "#adb5bd",
    textAlign: "center",
  },

  emptyGallery: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderStyle: "dashed",
    borderRadius: 10,
    backgroundColor: "#f8f9fa",
  },

  emptyGalleryText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "600",
  },

  // Bottom Navigation
  bottomNavigation: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 12,
    // paddingBottom: Platform.OS === "ios" ? 28 : 12,
  },

  navigationButtons: {
    flexDirection: "row",
    alignItems: "center",
  },

  spacer: {
    flex: 1,
  },

  previousButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },

  previousButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "600",
  },

  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#007BFF",
    borderRadius: 20,
    shadowColor: "#007BFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  nextButtonText: {
    marginRight: 4,
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
  },

  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#28a745",
    borderRadius: 20,
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  submitButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
  },

  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#dc3545",
    borderRadius: 20,
  },

  cancelButtonText: {
    color: "#dc3545",
    fontSize: 14,
    fontWeight: "600",
  },
})
