import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Google from "../../../assets/icons/google_icon.svg"
import { COLORS } from "../../utils/constants"
import { FormData, AuthFormProps } from "../../types/auth"

interface LoginFormProps extends AuthFormProps {
  onGoogleLogin: () => Promise<void>
  googleLoading: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading,
  onSwitchMode,
  onForgotPassword,
  onGoogleLogin,
  googleLoading,
}) => {
  const [formData, setFormData] = useState<Partial<FormData>>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const updateFormData = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (): Promise<void> => {
    if (!formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }
    await onSubmit(formData)
  }

  return (
    <View style={styles.container}>
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
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder='Enter your password'
            value={formData.password}
            onChangeText={(value) => updateFormData("password", value)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color='#666'
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.mainButton, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.mainButtonText}>
          {loading ? "Please wait..." : "Login"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.continueWithText}>CONTINUE WITH</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={onGoogleLogin}
        disabled={googleLoading}>
        {googleLoading ? (
          <ActivityIndicator
            size='small'
            color='#333'
          />
        ) : (
          <Google
            width={20}
            height={20}
          />
        )}
        <Text style={styles.googleButtonText}>
          {googleLoading ? "Connecting..." : "Google"}
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity onPress={onForgotPassword}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSwitchMode}
          style={styles.switchButton}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.linkText}>Register now</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default LoginForm

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeIcon: {
    paddingHorizontal: 16,
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
  continueWithText: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginBottom: 15,
    letterSpacing: 1,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  googleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  footer: {
    alignItems: "center",
    gap: 15,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  linkText: {
    color: "#4A90E2",
    fontWeight: "500",
  },
  switchButton: {
    marginTop: 10,
  },
})
