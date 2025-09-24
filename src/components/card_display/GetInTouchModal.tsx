import React, { useEffect, useState } from "react"
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { postData } from "../../api/apiServices"
import { endpoints } from "../../api/ClientApi"

const { width, height } = Dimensions.get("window")

interface GetInTouchModalProps {
  visible: boolean
  onClose: () => void
  businessCard: object
  primaryColor: string
}

const GetInTouchModal: React.FC<GetInTouchModalProps> = ({
  visible,
  onClose,
  businessCard,
  primaryColor,
}) => {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      Alert.alert("All fields are required")
      return
    }

    const cardId = businessCard._id
    // Check if user_id is an object with _id—else, treat as string
    let userId
    if (
      businessCard?.user_id &&
      typeof businessCard.user_id === "object" &&
      businessCard.user_id._id
    ) {
      userId = businessCard.user_id
    } else {
      userId = {
        _id: businessCard?.user_id || "",
        name: businessCard?.name || "",
        email: businessCard?.email || "",
      }
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        cardId,
        userId,
      }
      await postData(endpoints.submitLeads, payload)
      Alert.alert("Success", "Your message has been sent!")
      setForm({ name: "", email: "", message: "" })
      onClose()
    } catch (error) {
      Alert.alert("Error", "Couldn't send your message.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType='slide'
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.centered}>
            <TouchableWithoutFeedback>
              <View style={styles.container}>
                {/* Close */}
                <TouchableOpacity
                  style={styles.close}
                  onPress={onClose}>
                  <MaterialIcons
                    name='close'
                    size={24}
                    color='#666'
                  />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.header}>
                  <MaterialIcons
                    name='contact-mail'
                    size={32}
                    color={primaryColor}
                  />
                  <Text style={styles.title}>Get In Touch</Text>
                  <Text style={styles.subtitle}>
                    Reach out by submitting your details below.
                  </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                  <TextInput
                    style={styles.input}
                    placeholder='Name'
                    value={form.name}
                    onChangeText={(v) => handleChange("name", v)}
                    autoCapitalize='words'
                  />
                  <TextInput
                    style={styles.input}
                    placeholder='Email'
                    value={form.email}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    onChangeText={(v) => handleChange("email", v)}
                  />
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder='Message'
                    value={form.message}
                    multiline
                    numberOfLines={4}
                    onChangeText={(v) => handleChange("message", v)}
                  />
                </View>

                {/* Actions */}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: primaryColor }]}
                  onPress={handleSubmit}
                  disabled={loading}>
                  {loading ? (
                    <Text style={styles.buttonText}>Sending...</Text>
                  ) : (
                    <Text style={styles.buttonText}>Send</Text>
                  )}
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(44,62,80,0.56)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centered: { flex: 1, justifyContent: "center" },
  container: {
    width: width * 0.93,
    maxWidth: 410,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    elevation: 10,
    shadowColor: "#222",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    position: "relative",
  },
  close: {
    position: "absolute",
    top: 12,
    right: 10,
    zIndex: 10,
    backgroundColor: "#f3f6fa",
    borderRadius: 20,
    padding: 6,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
    marginTop: 15,
  },
  title: {
    fontSize: 21,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 3,
    color: "#333",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#769",
    textAlign: "center",
    marginBottom: 10,
    opacity: 0.9,
  },
  form: {
    gap: 15,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#f7f8fa",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1a2",
    borderWidth: 1,
    borderColor: "#e3e3eb",
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  button: {
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 5,
    elevation: 2,
    shadowColor: "#222",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.2,
  },
})

export default GetInTouchModal
