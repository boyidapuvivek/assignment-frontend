import React, { useState } from "react"
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"

const GetInTouchModal = ({ visible, onClose, businessCard, primaryColor }) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  const handleChange = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = () => {
    // submission logic here
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className='flex-1 bg-black/50 justify-end'>
        <View className='bg-white rounded-t-3xl max-h-[90%] shadow-2xl'>
          <View className='flex-row justify-between items-center p-5 border-b border-gray-100'>
            <Text className='text-lg font-semibold text-gray-800'>
              Get In Touch
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className='p-1'>
              <Ionicons
                name='close'
                size={24}
                color='#666'
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            className='p-5'
            showsVerticalScrollIndicator={false}>
            <View className='mb-5'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                Name
              </Text>
              <TextInput
                className='border border-gray-200 rounded-lg px-3 py-3 text-base text-gray-800 bg-white'
                placeholder='Your name'
                value={form.name}
                onChangeText={(value) => handleChange("name", value)}
                placeholderTextColor='#999'
              />
            </View>

            <View className='mb-5'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                Email
              </Text>
              <TextInput
                className='border border-gray-200 rounded-lg px-3 py-3 text-base text-gray-800 bg-white'
                placeholder='Your email'
                value={form.email}
                onChangeText={(value) => handleChange("email", value)}
                keyboardType='email-address'
                autoCapitalize='none'
                placeholderTextColor='#999'
              />
            </View>

            <View className='mb-5'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                Message
              </Text>
              <TextInput
                className='border border-gray-200 rounded-lg px-3 py-3 text-base text-gray-800 bg-white h-24'
                placeholder='Your message'
                value={form.message}
                onChangeText={(value) => handleChange("message", value)}
                multiline={true}
                numberOfLines={4}
                textAlignVertical='top'
                placeholderTextColor='#999'
              />
            </View>

            <TouchableOpacity
              className='rounded-lg py-3.5 items-center mt-2'
              style={{ backgroundColor: primaryColor || "#2196F3" }}
              onPress={handleSubmit}>
              <Text className='text-white text-base font-semibold'>Send</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default GetInTouchModal
