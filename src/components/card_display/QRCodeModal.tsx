import React from "react"
import {
  Modal,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Text,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

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

              {/* QR Code or Placeholder */}
              <View style={styles.qrContainer}>
                {businessCard?.qr_code ? (
                  <Image
                    source={{ uri: businessCard.qr_code }}
                    style={styles.qrCodeImage}
                    resizeMode='contain'
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

              {/* Instructions */}
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
