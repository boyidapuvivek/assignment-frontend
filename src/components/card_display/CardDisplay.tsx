import React, { useState, useEffect } from "react"
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import {
  handleSocialMediaPress,
  handlePhonePress,
  handleEmailPress,
  handleLocationPress,
  handleShare,
  handleSaveVCard,
  sendCard,
  handleSendCard,
} from "../../utils/cardDisplayFunctions"
import { useAuth } from "../../context/AuthContext"
import QRCodeModal from "./QRCodeModal"
import RenderTabContent from "./RenderTabContent"
import GetInTouchModal from "./GetInTouchModal"
import CustomButton from "../CustomButton"

import QR from "@assets/icons/card_display/qr.svg"
import Save from "@assets/icons/card_display/save_contact.svg"
import Share from "@assets/icons/card_display/share.svg"
import Facebook from "@assets/icons/card_display/facebook.svg"
import Insta from "@assets/icons/card_display/instagram.svg"
import Linkedin from "@assets/icons/card_display/linkedin.svg"
import Youtube from "@assets/icons/card_display/youtube.svg"
import Website from "@assets/icons/card_display/globe.svg"
import X from "@assets/icons/card_display/x.svg"
import SendCard from "@assets/icons/card_display/send_card.svg"
import GetInTouch from "@assets/icons/card_display/getintouch.svg"

const { width } = Dimensions.get("window")

const CardDisplay = ({
  businessCard,
  customizationSettings = {},
  showAllActionButtons = false,
  onSaveToggle,
}) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("Contact")
  const [isSaved, setIsSaved] = useState(businessCard?.isSaved || false)
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showGetInTouchModal, setShowGetInTouchModal] = useState(false)
  const [showFullCard, setShowFullCard] = useState(false)

  const primaryColor = customizationSettings?.primaryColor || "#2196F3"

  // Tabs logic based on data and customization
  const getAvailableTabs = () => {
    const tabs = ["Contact"]
    if (customizationSettings?.showServices && businessCard?.services?.length)
      tabs.push("Services")
    if (customizationSettings?.showProducts && businessCard?.products?.length)
      tabs.push("Products")
    if (customizationSettings?.showGallery && businessCard?.gallery?.length)
      tabs.push("Gallery")
    return tabs
  }

  const availableTabs = getAvailableTabs()

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) setActiveTab(availableTabs[0])
  }, [availableTabs, activeTab])

  // Save Card handler with state
  const handleSaveToggle = async () => {
    if (!businessCard?.id) {
      Alert.alert("Error", "Card ID not found")
      return
    }

    setIsSaveLoading(true)
    try {
      if (isSaved) {
        // Remove logic here (e.g., API endpoint)
        setIsSaved(false)
        Alert.alert("Success", "Card removed from saved collection")
      } else {
        // Save logic here (e.g., API endpoint)
        setIsSaved(true)
        Alert.alert("Success", "Card saved to your collection")
      }

      if (onSaveToggle) onSaveToggle(businessCard.id, !isSaved)
    } catch (error) {
      Alert.alert(
        "Error",
        isSaved ? "Failed to remove card" : "Failed to save card"
      )
    } finally {
      setIsSaveLoading(false)
    }
  }

  return (
    <ScrollView
      className='flex-1 bg-white rounded-3xl '
      //shadow styles
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
      }}
      showsVerticalScrollIndicator={false}>
      {/* Cover Image */}
      <View className='relative h-52 rounded-t-2xl '>
        <Image
          source={{
            uri:
              businessCard?.business_cover_photo ||
              "https://via.placeholder.com/400x200",
          }}
          className='w-full h-full rounded-t-3xl'
          resizeMode='cover'
        />
      </View>

      {/* Profile Image Overlap */}
      <View className='ml-4 -mt-12'>
        <Image
          source={{
            uri: businessCard?.profile_image,
          }}
          className='w-24 h-24 rounded-full border-2 border-white'
        />
        {/* QR Code Button */}

        <CustomButton
          className='absolute mt-14 right-4 flex-row items-center p-3 rounded-lg border border-primary gap-2'
          onPress={() => setShowQRModal(true)}
          title='My QR'
          textStyles='text-lg font-poppins-semibold ml-1 text-primary'>
          <QR
            height={20}
            width={20}
          />
        </CustomButton>

        {showAllActionButtons && (
          // <TouchableOpacity
          //   className='absolute mt-32 right-4 flex-row items-center p-3 rounded-lg border border-black gap-2'
          //   onPress={() =>
          //     handleSendCard(
          //       user?._id,
          //       businessCard?.user_id?._id || businessCard?.user_id
          //     )
          //   }>
          //
          //   <Text className='mt-1 color-textblack font-poppins-regular text-base'>
          //     Send Card
          //   </Text>
          // </TouchableOpacity>

          <CustomButton
            className='absolute mt-32 right-4 flex-row items-center p-3 rounded-lg border border-black gap-2'
            onPress={() =>
              handleSendCard(
                user?._id,
                businessCard?.user_id?._id || businessCard?.user_id
              )
            }
            title='Send Card'
            textStyles='mt-1 color-textblack font-poppins-regular text-base'>
            <SendCard
              height={24}
              width={24}
            />
          </CustomButton>
        )}
      </View>

      {/* Card Content */}
      <View className='px-4 pt-4'>
        {/*Text Content*/}
        <Text className='text-2xl font-poppins-semibold text-textblack mb-1'>
          {businessCard?.name || "John Doe"}
        </Text>
        <Text className='text-base text-subtext font-poppins-regular mb-0.5'>
          {businessCard?.role || "Backend Developer"}
        </Text>
        <Text className='text-base text-subtext font-poppins-regular mb-3'>
          {businessCard?.company || "ABC Company"}
        </Text>

        {businessCard.address && (
          <TouchableOpacity
            className='flex-row items-center mb-4'
            onPress={() => handleLocationPress(businessCard?.address)}>
            <MaterialIcons
              name='location-on'
              size={16}
              color='#666'
            />
            <Text className='text-sm text-subtext font-poppins-regular  ml-1'>
              {businessCard?.address}
            </Text>
          </TouchableOpacity>
        )}

        {!businessCard.business_description && (
          <Text className='text-sm text-paragraph mb-5'>
            {businessCard?.business_description ||
              "Lorem ipsum dolor sit amet consectetur. Nunc pharetra sem cras bibendum elit imperdiet."}
          </Text>
        )}

        <View className='flex-1 justify-center my-4 px-14'>
          {/* Social Links */}
          <View className='flex-row mb-6 justify-between'>
            <TouchableOpacity
              onPress={() =>
                handleSocialMediaPress(businessCard?.facebook_url, "facebook")
              }>
              <Facebook
                height={32}
                width={32}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleSocialMediaPress(businessCard?.twitter_url, "twitter")
              }>
              <X
                height={32}
                width={32}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleSocialMediaPress(businessCard?.linkedin_url, "linkedin")
              }>
              <Linkedin
                height={32}
                width={32}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleSocialMediaPress(businessCard?.instagram_url, "instagram")
              }>
              <Insta
                height={32}
                width={32}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleSocialMediaPress(businessCard?.youtube_url, "youtube")
              }>
              <Youtube
                height={32}
                width={32}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleSocialMediaPress(businessCard?.website, "website")
              }>
              <Website
                height={32}
                width={32}
              />
            </TouchableOpacity>
          </View>

          {/* Save/Share Actions */}
          <View className='flex-row mb-6 justify-between'>
            <CustomButton
              title='Save Contact'
              className='bg-buttonblue rounded-lg p-2 gap-3 text-base'
              onPress={() => handleSaveVCard(businessCard)}
              textStyles='font-poppins-regular color-white text-base'>
              <Save
                height={24}
                width={24}
              />
            </CustomButton>

            <CustomButton
              title='Share'
              className='bg-textwhite border rounded-lg p-2 gap-3'
              textStyles='font-poppins-regular text-base'
              onPress={() => handleShare(businessCard?._id)}>
              <Share
                height={24}
                width={24}
              />
            </CustomButton>
          </View>
          {showAllActionButtons && (
            <CustomButton
              title='Get In Touch'
              className='bg-textwhite border border-primary rounded-lg p-2 gap-3'
              textStyles='font-poppins-regular text-base color-primary'
              onPress={() => setShowGetInTouchModal(true)}>
              <GetInTouch
                height={24}
                width={24}
              />
            </CustomButton>
          )}
        </View>

        {/* View more prompt */}
        {showFullCard ? (
          <TouchableOpacity onPress={() => setShowFullCard(false)}>
            <Text className='text-lg font-poppins-semibold text-primary text-center mb-5'>
              View Less
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowFullCard(true)}>
            <Text className='text-lg font-poppins-semibold text-primary text-center mb-5'>
              View More
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {showFullCard && (
        <View className='rounded-2xl bg-secondary px-2'>
          {/* Tabs Bar */}
          <View className='flex-row justify-around  border-t border-gray-200 rounded-full mt-4 bg-white opacity-70'>
            {availableTabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                className='flex-1 py-3 items-center '
                onPress={() => setActiveTab(tab)}>
                <Text
                  className={`text-base font-poppins-semibold ${
                    activeTab === tab ? "color-primary" : "color-black4"
                  }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Contents */}
          <View className=' py-4'>
            <RenderTabContent
              activeTab={activeTab}
              businessCard={businessCard}
              customizationSettings={customizationSettings}
              primaryColor={primaryColor}
            />
          </View>
        </View>
      )}
      {/* Modals */}
      <QRCodeModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        businessCard={businessCard}
        primaryColor={primaryColor}
      />

      <GetInTouchModal
        visible={showGetInTouchModal}
        onClose={() => setShowGetInTouchModal(false)}
        businessCard={businessCard}
        primaryColor={primaryColor}
      />
    </ScrollView>
  )
}

export default CardDisplay
