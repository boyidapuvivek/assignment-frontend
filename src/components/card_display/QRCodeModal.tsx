import React from "react"
import { View, Modal, TouchableOpacity, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import QRCode from "react-native-qrcode-svg"

const QRCodeModal = ({ visible, onClose, businessCard, primaryColor }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onClose}>
      <View className='flex-1 bg-black/50 justify-center items-center px-5'>
        <View className='bg-white rounded-xl w-full max-w-sm shadow-lg'>
          <View className='flex-row justify-between items-center p-5 border-b border-gray-100'>
            <Text className='text-lg font-semibold text-gray-800'>QR Code</Text>
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

          <View className='items-center py-8 px-5'>
            {businessCard?._id ? (
              <QRCode
                value={`https://connectree.co/card/${businessCard?._id}`}
                size={200}
                color={primaryColor || "#2196F3"}
                backgroundColor='white'
              />
            ) : (
              <View className='w-50 h-50 bg-gray-200 rounded-lg items-center justify-center'>
                <Text className='text-gray-500'>No QR Code</Text>
              </View>
            )}
            <Text className='text-center mt-5 text-sm text-gray-600 leading-5'>
              Scan to view {businessCard?.name || "this"} business card
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default QRCodeModal
