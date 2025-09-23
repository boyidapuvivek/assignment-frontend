import React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

const RenderTabContent = ({
  activeTab,
  businessCard,
  customizationSettings,
  primaryColor,
  textColor,
  styles,
  handlePhonePress,
  handleEmailPress,
  handleLocationPress,
  handleSocialMediaPress,
}: any) => {
  switch (activeTab) {
    case "Contact":
      return (
        <View style={styles.contactSection}>
          {customizationSettings.showPersonalContact && (
            <>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Personal Contact
              </Text>
              {/* Phone */}
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handlePhonePress(businessCard?.phone)}>
                <View
                  style={[
                    styles.contactIconContainer,
                    { backgroundColor: primaryColor + "20" },
                  ]}>
                  <MaterialIcons
                    name='phone'
                    size={18}
                    color={primaryColor}
                  />
                </View>
                <Text
                  style={[
                    styles.contactText,
                    { color: businessCard?.phone ? textColor : primaryColor },
                  ]}>
                  {businessCard?.phone || "No phone number"}
                </Text>
              </TouchableOpacity>
              {/* Email */}
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handleEmailPress(businessCard?.email)}>
                <View
                  style={[
                    styles.contactIconContainer,
                    { backgroundColor: primaryColor + "20" },
                  ]}>
                  <MaterialIcons
                    name='email'
                    size={18}
                    color={primaryColor}
                  />
                </View>
                <Text
                  style={[
                    styles.contactText,
                    { color: businessCard?.email ? textColor : primaryColor },
                  ]}>
                  {businessCard?.email || "No email"}
                </Text>
              </TouchableOpacity>
              {/* Address */}
              {businessCard?.address && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() => handleLocationPress(businessCard?.address)}>
                  <View
                    style={[
                      styles.contactIconContainer,
                      { backgroundColor: primaryColor + "20" },
                    ]}>
                    <MaterialIcons
                      name='location-on'
                      size={18}
                      color={primaryColor}
                    />
                  </View>
                  <Text style={[styles.contactText, { color: primaryColor }]}>
                    {businessCard.address}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {customizationSettings.showBusinessContact && (
            <>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Business Contact
              </Text>
              <View style={styles.contactItem}>
                <View
                  style={[
                    styles.contactIconContainer,
                    { backgroundColor: `${primaryColor}20` },
                  ]}>
                  <MaterialIcons
                    name='business'
                    size={18}
                    color={primaryColor}
                  />
                </View>
                <Text style={[styles.contactText, { color: textColor }]}>
                  {businessCard?.company || "No company name"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handleEmailPress(businessCard?.business_email)}>
                <View
                  style={[
                    styles.contactIconContainer,
                    { backgroundColor: `${primaryColor}20` },
                  ]}>
                  <MaterialIcons
                    name='email'
                    size={18}
                    color={primaryColor}
                  />
                </View>
                <Text
                  style={[
                    styles.contactText,
                    {
                      color:
                        businessCard?.business_email &&
                        businessCard.business_email !== "No business email"
                          ? primaryColor
                          : textColor,
                    },
                  ]}>
                  {businessCard?.business_email || "No business email"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={() => handlePhonePress(businessCard?.business_phone)}>
                <View
                  style={[
                    styles.contactIconContainer,
                    { backgroundColor: `${primaryColor}20` },
                  ]}>
                  <MaterialIcons
                    name='phone'
                    size={18}
                    color={primaryColor}
                  />
                </View>
                <Text
                  style={[
                    styles.contactText,
                    {
                      color:
                        businessCard?.business_phone &&
                        businessCard.business_phone !== "No business phone"
                          ? primaryColor
                          : textColor,
                    },
                  ]}>
                  {businessCard?.business_phone || "No business phone"}
                </Text>
              </TouchableOpacity>
              {businessCard?.website && (
                <TouchableOpacity
                  style={styles.contactItem}
                  onPress={() =>
                    handleSocialMediaPress(businessCard.website, "Website")
                  }>
                  <View
                    style={[
                      styles.contactIconContainer,
                      { backgroundColor: `${primaryColor}20` },
                    ]}>
                    <MaterialIcons
                      name='language'
                      size={18}
                      color={primaryColor}
                    />
                  </View>
                  <Text style={[styles.contactText, { color: primaryColor }]}>
                    {businessCard.website}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {customizationSettings.showSocialMedia && (
            <>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Social Media
              </Text>
              <View style={styles.socialMediaContainer}>
                <TouchableOpacity
                  style={styles.socialIcon}
                  onPress={() =>
                    handleSocialMediaPress(businessCard?.youtube_url, "Youtube")
                  }>
                  <View
                    style={[
                      styles.socialIconBg,
                      { backgroundColor: "#FF0000" },
                    ]}>
                    <MaterialIcons
                      name='video-library'
                      size={20}
                      color='#fff'
                    />
                  </View>
                  <Text style={styles.socialLabel}>Youtube</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialIcon}
                  onPress={() =>
                    handleSocialMediaPress(businessCard?.twitter_url, "Twitter")
                  }>
                  <View
                    style={[
                      styles.socialIconBg,
                      { backgroundColor: "#1DA1F2" },
                    ]}>
                    <MaterialIcons
                      name='alternate-email'
                      size={20}
                      color='#fff'
                    />
                  </View>
                  <Text style={styles.socialLabel}>Twitter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialIcon}
                  onPress={() =>
                    handleSocialMediaPress(
                      businessCard?.linkedin_url,
                      "LinkedIn"
                    )
                  }>
                  <View
                    style={[
                      styles.socialIconBg,
                      { backgroundColor: "#0077B5" },
                    ]}>
                    <MaterialIcons
                      name='work'
                      size={20}
                      color='#fff'
                    />
                  </View>
                  <Text style={styles.socialLabel}>LinkedIn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialIcon}
                  onPress={() =>
                    handleSocialMediaPress(
                      businessCard?.instagram_url,
                      "Instagram"
                    )
                  }>
                  <View
                    style={[
                      styles.socialIconBg,
                      { backgroundColor: "#E4405F" },
                    ]}>
                    <MaterialIcons
                      name='camera-alt'
                      size={20}
                      color='#fff'
                    />
                  </View>
                  <Text style={styles.socialLabel}>Instagram</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      )

    case "Services":
      if (!customizationSettings.showServices) return null
      return (
        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Our Services
          </Text>
          {businessCard?.services && businessCard.services.length > 0 ? (
            businessCard.services.map((service, index) => (
              <View
                key={index}
                style={[styles.serviceCard, { borderLeftColor: primaryColor }]}>
                <View style={styles.serviceHeader}>
                  <View
                    style={[
                      styles.serviceIconContainer,
                      { backgroundColor: `${primaryColor}20` },
                    ]}>
                    <MaterialIcons
                      name='work'
                      size={24}
                      color={primaryColor}
                    />
                  </View>
                  <View style={styles.serviceDetails}>
                    <Text style={[styles.serviceName, { color: textColor }]}>
                      {service.name}
                    </Text>
                    <Text style={styles.serviceDescription}>
                      {service.description || "Professional service"}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Starting from</Text>
                    <Text style={[styles.priceText, { color: primaryColor }]}>
                      ₹{service.price}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No services added yet</Text>
          )}
          <TouchableOpacity
            style={[styles.inquireButton, { backgroundColor: primaryColor }]}>
            <MaterialIcons
              name='help'
              size={20}
              color='#fff'
            />
            <Text style={styles.inquireButtonText}>Inquire Now</Text>
          </TouchableOpacity>
        </View>
      )

    case "Products":
      if (!customizationSettings.showProducts) return null
      return (
        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Our Products
          </Text>
          {businessCard?.products && businessCard.products.length > 0 ? (
            businessCard.products.map((product, index) => (
              <View
                key={index}
                style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  <View
                    style={[
                      styles.productImagePlaceholder,
                      { backgroundColor: `${primaryColor}20` },
                    ]}>
                    <MaterialIcons
                      name='inventory'
                      size={32}
                      color={primaryColor}
                    />
                  </View>
                </View>
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, { color: textColor }]}>
                    {product.name}
                  </Text>
                  <Text style={styles.productDescription}>
                    {product.description || "Quality product"}
                  </Text>
                  <View style={styles.productPriceContainer}>
                    <Text
                      style={[styles.productPrice, { color: primaryColor }]}>
                      ₹{product.price}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.addToCartButton,
                        { backgroundColor: primaryColor },
                      ]}>
                      <MaterialIcons
                        name='add-shopping-cart'
                        size={18}
                        color='#fff'
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No products added yet</Text>
          )}
          <TouchableOpacity
            style={[styles.viewAllButton, { borderColor: primaryColor }]}>
            <MaterialIcons
              name='shopping-cart'
              size={20}
              color={primaryColor}
            />
            <Text style={[styles.viewAllButtonText, { color: primaryColor }]}>
              View All Products
            </Text>
          </TouchableOpacity>
        </View>
      )

    case "Gallery":
      if (!customizationSettings.showGallery) return null
      return (
        <View style={styles.contactSection}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Gallery
          </Text>
          {businessCard?.gallery && businessCard.gallery.length > 0 ? (
            <View style={styles.galleryGrid}>
              {businessCard.gallery.map((image, index) => (
                <View
                  key={index}
                  style={styles.galleryItem}>
                  <Image
                    source={{ uri: image.url }}
                    style={styles.galleryImage}
                    resizeMode='cover'
                  />
                  <View style={styles.galleryOverlay}>
                    <MaterialIcons
                      name='zoom-in'
                      size={16}
                      color='#fff'
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDataText}>No gallery images added yet</Text>
          )}
        </View>
      )
    default:
      return null
  }
}

export default RenderTabContent
