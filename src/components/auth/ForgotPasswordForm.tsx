import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native"
import { FormData, AuthFormProps } from "../../types/auth"

interface ForgotPasswordFormProps extends AuthFormProps {
  onBackToLogin: () => void
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  loading,
  onBackToLogin,
}) => {
  const [formData, setFormData] = useState<Partial<FormData>>({
    email: "",
    newPassword: "",
  })

  const updateFormData = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (): Promise<void> => {
    if (!formData.email || !formData.newPassword) {
      Alert.alert("Error", "Please enter email and new password")
      return
    }
    await onSubmit(formData)
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and new password to reset your account
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter your email'
          value={formData.email}
          onChangeText={(value) => updateFormData("email", value)}
          keyboardType='email-address'
          autoCapitalize='none'
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter your new password'
          value={formData.newPassword}
          onChangeText={(value) => updateFormData("newPassword", value)}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={[styles.mainButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.mainButtonText}>
          {loading ? "Please wait..." : "Update Password"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onBackToLogin}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ForgotPasswordForm

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  mainButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 25,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
  },
  linkText: {
    color: "#4A90E2",
    fontWeight: "500",
  },
})
