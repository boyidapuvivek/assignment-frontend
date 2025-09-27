import React from "react"
import { View, Image, Text, TouchableOpacity, ScrollView } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

import Phone from "@assets/icons/card_display/phone.svg"
import Mail from "@assets/icons/card_display/mail.svg"
import Ping from "@assets/icons/card_display/ping.svg"
import Globe from "@assets/icons/card_display/globe_blue.svg"

const RenderTabContent = ({
  activeTab,
  businessCard,
  customizationSettings,
  primaryColor,
}) => {
  if (activeTab === "Contact") {
    return (
      <ScrollView
        className='flex-1 p-4'
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
        }}>
        <View className='bg-white opacity-70 rounded-2xl py-3 px-7 gap-3'>
          {/* Personal Contact Section */}
          <Text className='text-xl font-poppins-semibold text-black '>
            Personal Contact
          </Text>

          <TouchableOpacity
            className='flex-row items-center px-2'
            onPress={() => {
              /* call logic for personal phone */
            }}>
            <Phone
              height={18}
              width={18}
            />
            <Text
              className='ml-3 text-base font-poppins-regular text-black flex-1'
              numberOfLines={1}>
              {businessCard?.personal_phone ||
                businessCard?.phone ||
                "0000000000"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='flex-row items-center px-2'
            onPress={() => {
              /* email logic for personal email */
            }}>
            <Mail
              height={18}
              width={18}
            />
            <Text
              className='ml-3 text-base font-poppins-regular text-black flex-1'
              numberOfLines={1}>
              {businessCard?.personal_email ||
                businessCard?.email ||
                "persona@gmail.com"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className='bg-white opacity-70 rounded-2xl py-3 px-7 gap-3 mt-7'>
          {/* Business Contact Section */}
          <Text
            className='text-xl font-poppins-semibold text-black'
            numberOfLines={1}>
            Business Contact
          </Text>

          <TouchableOpacity
            className='flex-row items-center px-2'
            onPress={() => {
              /* call logic for business phone */
            }}>
            <Phone
              height={18}
              width={18}
            />
            <Text
              className='ml-3 text-base font-poppins-regular text-black flex-1'
              numberOfLines={1}>
              {businessCard?.business_phone ||
                businessCard?.phone ||
                "0000000000"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='flex-row items-center px-2'
            onPress={() => {
              /* email logic for business email */
            }}>
            <Mail
              height={18}
              width={18}
            />
            <Text
              className='ml-3 text-base font-poppins-regular text-black flex-1'
              numberOfLines={1}>
              {businessCard?.business_email ||
                businessCard?.email ||
                "persona@gmail.com"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='flex-row items-center px-2'
            onPress={() => {
              /* location logic */
            }}>
            <Ping
              height={18}
              width={18}
            />
            <Text
              className=' ml-3 text-base font-poppins-regular text-black flex-1'
              numberOfLines={1}>
              {businessCard?.address ||
                businessCard?.location ||
                "Visakhapatnam"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className='flex-row items-center px-2'
            onPress={() => {
              /* web logic */
            }}>
            <Globe
              height={18}
              width={18}
            />
            <Text
              className='ml-3 text-base font-poppins-regular text-black flex-1'
              numberOfLines={1}>
              {businessCard?.website || "connctree.co"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  if (activeTab === "Services") {
    return (
      <ScrollView className='flex-1 p-4'>
        <Text className='text-lg font-semibold text-gray-800 mb-4'>
          Our Services
        </Text>
        {businessCard?.services?.map((service, index) => (
          <View
            key={index}
            className='bg-white rounded-xl mb-3 shadow-sm border border-gray-100'>
            <View className='p-4'>
              <Text
                className='text-base font-semibold text-gray-800 mb-1'
                numberOfLines={1}>
                {service.name}
              </Text>
              <Text className='text-sm text-gray-600 leading-5 mb-2'>
                {service.description}
              </Text>
              <Text
                className='text-base font-semibold'
                style={{ color: primaryColor || "#2196F3" }}>
                {service.price}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    )
  }

  if (activeTab === "Products") {
    return (
      <ScrollView className='flex-1 p-4'>
        <Text className='text-lg font-semibold text-gray-800 mb-4'>
          Our Products
        </Text>
        {businessCard?.products?.map((product, index) => (
          <View
            key={index}
            className='bg-white rounded-xl mb-3 shadow-sm border border-gray-100'>
            <View className='p-4'>
              <Text className='text-base font-semibold text-gray-800 mb-1'>
                {product.name}
              </Text>
              <Text className='text-sm text-gray-600 leading-5 mb-2'>
                {product.description}
              </Text>
              <Text
                className='text-base font-semibold'
                style={{ color: primaryColor || "#2196F3" }}>
                {product.price}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    )
  }

  if (activeTab === "Gallery") {
    return (
      <ScrollView className='flex-1 p-4'>
        <View className='flex-row flex-wrap justify-between'>
          {businessCard?.gallery?.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              className='w-[48%] aspect-square rounded-lg mb-2'
              resizeMode='cover'
            />
          ))}
        </View>
      </ScrollView>
    )
  }

  return null
}

export default RenderTabContent
