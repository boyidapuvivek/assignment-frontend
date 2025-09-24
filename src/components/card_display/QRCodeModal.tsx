import React from "react"
import { Modal } from "react-native"
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Text,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import QRCode from "react-native-qrcode-svg"

interface QRCodeModalProps {
  visible: boolean
  onClose: () => void
  businessCard: any
  primaryColor: string
  styles: any
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  visible,
  onClose,
  businessCard,
  primaryColor,
  styles,
}) => {
  // Compose the URL using the business card's user id (change the key as needed)
  const link = businessCard?._id
    ? `https://dev.connectree.co/card/${businessCard._id}`
    : ""

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}>
                <MaterialIcons
                  name='close'
                  size={20}
                  color='#666'
                />
              </TouchableOpacity>
              {/* Header */}
              <View style={styles.modalHeader}>
                <MaterialIcons
                  name='qr-code'
                  size={32}
                  color={primaryColor}
                />
                <Text style={styles.modalTitle}>QR Code</Text>
                <Text style={styles.modalSubtitle}>
                  Scan to view {businessCard?.name} business card
                </Text>
              </View>
              {/* QR Code */}
              <View style={styles.qrContainer}>
                {link ? (
                  <QRCode
                    value={link}
                    size={200}
                    color={primaryColor}
                    backgroundColor='#fff'
                  />
                ) : (
                  <View style={styles.qrPlaceholder}>
                    <MaterialIcons
                      name='qr-code'
                      size={48}
                      color='#ccc'
                    />
                    <Text style={styles.qrPlaceholderText}>
                      QR Code Not Available
                    </Text>
                  </View>
                )}
              </View>
              {/* Card Info */}
              <View style={styles.modalCardInfo}>
                <Text style={styles.modalCardName}>
                  {businessCard?.name} Business Card
                </Text>
                <Text style={styles.modalCardRole}>
                  {businessCard?.role}{" "}
                  {businessCard?.company && `· ${businessCard.company}`}
                </Text>
              </View>
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsText}>
                  Point your camera at the QR code to instantly access this
                  business card
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default QRCodeModal
