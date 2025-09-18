import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  Alert,
  Dimensions,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"

const windowWidth = Dimensions.get("window").width

export default function EditBusinessCardForm({
  businessCard,
  onSave,
  onCancel,
}) {
  const tabs = [
    "Personal",
    "Business",
    "Social",
    "Services",
    "Products",
    "Gallery",
  ]
  const [activeTab, setActiveTab] = useState("Personal")

  // State sections
  const [personal, setPersonal] = useState({
    name: businessCard?.name || "",
    email: businessCard?.email || "",
    phone: businessCard?.phone || "",
    role: businessCard?.role || "",
    profile_image: businessCard?.profile_image || "",
    custom_notes: businessCard?.custom_notes || "",
  })

  const [business, setBusiness] = useState({
    company: businessCard?.company || "",
    business_email: businessCard?.business_email || "",
    business_phone: businessCard?.business_phone || "",
    business_description: businessCard?.business_description || "",
    business_cover_photo: businessCard?.business_cover_photo || "",
    address: businessCard?.address || "",
  })

  const [social, setSocial] = useState({
    facebook_url: businessCard?.facebook_url || "",
    instagram_url: businessCard?.instagram_url || "",
    linkedin_url: businessCard?.linkedin_url || "",
    twitter_url: businessCard?.twitter_url || "",
    website: businessCard?.website || "",
    youtube_url: businessCard?.youtube_url || "",
  })

  const [services, setServices] = useState(businessCard?.services || [])
  const [products, setProducts] = useState(businessCard?.products || [])
  const [gallery, setGallery] = useState(businessCard?.gallery || [])

  const updateField = (section, key, value) => {
    if (section === "personal")
      setPersonal((prev) => ({ ...prev, [key]: value }))
    else if (section === "business")
      setBusiness((prev) => ({ ...prev, [key]: value }))
    else if (section === "social")
      setSocial((prev) => ({ ...prev, [key]: value }))
  }

  const pickImage = async (setter) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera roll permissions are required.")
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    })
    if (!result.canceled) {
      setter(result.assets[0].uri)
    }
  }

  const addGalleryImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera roll permissions are required.")
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    })
    if (!result.canceled) {
      setGallery((prev) => [...prev, result.assets[0].uri])
    }
  }
  const removeGalleryImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index))
  }

  const addService = () => {
    setServices((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        price: "",
        duration: "",
        category: "",
        description: "",
      },
    ])
  }
  const updateService = (index, key, value) => {
    const updated = [...services]
    updated[index] = { ...updated[index], [key]: value }
    setServices(updated)
  }
  const removeService = (index) => {
    setServices((prev) => prev.filter((_, i) => i !== index))
  }

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        price: "",
        category: "",
        description: "",
      },
    ])
  }
  const updateProduct = (index, key, value) => {
    const updated = [...products]
    updated[index] = { ...updated[index], [key]: value }
    setProducts(updated)
  }
  const removeProduct = (index) => {
    setProducts((prev) => prev.filter((_, i) => i !== index))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "Personal":
        return (
          <ScrollView style={styles.tabContent}>
            <TextInput
              style={styles.input}
              placeholder='Name'
              value={personal.name}
              onChangeText={(text) => updateField("personal", "name", text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Email'
              keyboardType='email-address'
              autoCapitalize='none'
              value={personal.email}
              onChangeText={(text) => updateField("personal", "email", text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Phone'
              keyboardType='phone-pad'
              value={personal.phone}
              onChangeText={(text) => updateField("personal", "phone", text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Role'
              value={personal.role}
              onChangeText={(text) => updateField("personal", "role", text)}
            />
            <View style={styles.imagePickerContainer}>
              <Text style={styles.imagePickerLabel}>Profile Image</Text>
              {personal.profile_image ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: personal.profile_image }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() =>
                      updateField("personal", "profile_image", "")
                    }>
                    <Ionicons
                      name='close-circle'
                      size={24}
                      color='red'
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.imageAddButton}
                  onPress={() =>
                    pickImage((uri) =>
                      updateField("personal", "profile_image", uri)
                    )
                  }>
                  <Text style={styles.imageAddButtonText}>
                    Add Profile Image
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder='Custom Notes'
              multiline
              numberOfLines={4}
              value={personal.custom_notes}
              onChangeText={(text) =>
                updateField("personal", "custom_notes", text)
              }
            />
          </ScrollView>
        )
      case "Business":
        return (
          <ScrollView style={styles.tabContent}>
            <TextInput
              style={styles.input}
              placeholder='Company'
              value={business.company}
              onChangeText={(text) => updateField("business", "company", text)}
            />
            <TextInput
              style={styles.input}
              placeholder='Business Email'
              keyboardType='email-address'
              autoCapitalize='none'
              value={business.business_email}
              onChangeText={(text) =>
                updateField("business", "business_email", text)
              }
            />
            <TextInput
              style={styles.input}
              placeholder='Business Phone'
              keyboardType='phone-pad'
              value={business.business_phone}
              onChangeText={(text) =>
                updateField("business", "business_phone", text)
              }
            />
            <View style={styles.imagePickerContainer}>
              <Text style={styles.imagePickerLabel}>Business Cover Photo</Text>
              {business.business_cover_photo ? (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: business.business_cover_photo }}
                    style={styles.coverPhotoPreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() =>
                      updateField("business", "business_cover_photo", "")
                    }>
                    <Ionicons
                      name='close-circle'
                      size={24}
                      color='red'
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.imageAddButton}
                  onPress={() =>
                    pickImage((uri) =>
                      updateField("business", "business_cover_photo", uri)
                    )
                  }>
                  <Text style={styles.imageAddButtonText}>Add Cover Photo</Text>
                </TouchableOpacity>
              )}
            </View>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder='Business Description'
              multiline
              numberOfLines={4}
              value={business.business_description}
              onChangeText={(text) =>
                updateField("business", "business_description", text)
              }
            />
            <TextInput
              style={styles.input}
              placeholder='Address'
              value={business.address}
              onChangeText={(text) => updateField("business", "address", text)}
            />
          </ScrollView>
        )
      case "Social":
        return (
          <ScrollView style={styles.tabContent}>
            {Object.keys(social).map((key) => (
              <TextInput
                key={key}
                style={styles.input}
                placeholder={`${key.replace(/_/g, " ")}`}
                autoCapitalize='none'
                value={social[key]}
                onChangeText={(text) => updateField("social", key, text)}
              />
            ))}
          </ScrollView>
        )
      case "Services":
        return (
          <ScrollView style={styles.tabContent}>
            {services.map((service, idx) => (
              <View
                key={service.id}
                style={styles.listItem}>
                <TextInput
                  style={styles.input}
                  placeholder='Service Name'
                  value={service.name}
                  onChangeText={(text) => updateService(idx, "name", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Price'
                  keyboardType='numeric'
                  value={service.price}
                  onChangeText={(text) => updateService(idx, "price", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Duration'
                  keyboardType='numeric'
                  value={service.duration}
                  onChangeText={(text) => updateService(idx, "duration", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Category'
                  value={service.category}
                  onChangeText={(text) => updateService(idx, "category", text)}
                />
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder='Description'
                  multiline
                  value={service.description}
                  onChangeText={(text) =>
                    updateService(idx, "description", text)
                  }
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeService(idx)}>
                  <Text style={styles.removeBtnText}>Remove Service</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={addService}>
              <Text style={styles.addBtnText}>Add Service</Text>
            </TouchableOpacity>
          </ScrollView>
        )
      case "Products":
        return (
          <ScrollView style={styles.tabContent}>
            {products.map((product, idx) => (
              <View
                key={product.id}
                style={styles.listItem}>
                <TextInput
                  style={styles.input}
                  placeholder='Product Name'
                  value={product.name}
                  onChangeText={(text) => updateProduct(idx, "name", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Price'
                  keyboardType='numeric'
                  value={product.price}
                  onChangeText={(text) => updateProduct(idx, "price", text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Category'
                  value={product.category}
                  onChangeText={(text) => updateProduct(idx, "category", text)}
                />
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder='Description'
                  multiline
                  value={product.description}
                  onChangeText={(text) =>
                    updateProduct(idx, "description", text)
                  }
                />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeProduct(idx)}>
                  <Text style={styles.removeBtnText}>Remove Product</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={addProduct}>
              <Text style={styles.addBtnText}>Add Product</Text>
            </TouchableOpacity>
          </ScrollView>
        )
      case "Gallery":
        return (
          <View style={[styles.tabContent, { paddingVertical: 20 }]}>
            <FlatList
              horizontal
              data={gallery}
              keyExtractor={(_, idx) => idx.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View style={styles.galleryItem}>
                  <Image
                    source={{ uri: item }}
                    style={styles.galleryImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButtonGallery}
                    onPress={() => removeGalleryImage(index)}>
                    <Ionicons
                      name='close-circle'
                      size={24}
                      color='red'
                    />
                  </TouchableOpacity>
                </View>
              )}
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.addGalleryButton}
                  onPress={addGalleryImage}>
                  <Ionicons
                    name='add'
                    size={36}
                    color='#007BFF'
                  />
                  <Text style={styles.addGalleryText}>Add Image</Text>
                </TouchableOpacity>
              }
            />
          </View>
        )
      default:
        return null
    }
  }

  const handleSavePress = () => {
    const combinedData = {
      ...personal,
      ...business,
      ...social,
      services,
      products,
      gallery,
    }
    onSave(combinedData)
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.activeTabButtonText,
              ]}
              numberOfLines={1}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderTabContent()}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelBtn]}
          onPress={onCancel}>
          <Text style={styles.buttonTextCancel}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveBtn]}
          onPress={handleSavePress}>
          <Text style={styles.buttonTextSave}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f9f9f9",
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },

  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#007BFF",
  },

  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#777",
  },

  activeTabButtonText: {
    color: "#007BFF",
  },

  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
    backgroundColor: "#fff",
  },

  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },

  imagePickerContainer: {
    marginBottom: 20,
  },

  imagePickerLabel: {
    fontWeight: "600",
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  },

  imagePreviewContainer: {
    position: "relative",
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },

  coverPhotoPreview: {
    width: "100%",
    height: 160,
    borderRadius: 12,
  },

  imageAddButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  imageAddButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 12,
    zIndex: 10,
  },

  listItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fefefe",
  },

  removeBtn: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: "#ff4444",
    borderRadius: 8,
  },

  removeBtnText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },

  addBtn: {
    backgroundColor: "#007BFF",
    borderRadius: 8,
    paddingVertical: 12,
  },

  addBtnText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },

  galleryItem: {
    marginRight: 12,
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },

  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },

  removeImageButtonGallery: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
    zIndex: 20,
  },

  addGalleryButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#007BFF",
  },

  addGalleryText: {
    color: "#007BFF",
    fontWeight: "600",
    marginTop: 6,
    fontSize: 14,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fefefe",
  },

  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 6,
  },

  cancelBtn: {
    backgroundColor: "#eee",
  },

  saveBtn: {
    backgroundColor: "#007BFF",
  },

  buttonTextCancel: {
    color: "#444",
    fontWeight: "600",
    fontSize: 16,
  },

  buttonTextSave: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
})
