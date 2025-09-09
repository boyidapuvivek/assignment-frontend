import React, { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useAuth } from "../../context/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { authAPI } from "../../utils/api"
import Logo from "../../../assets/logo.svg"
import { COLORS } from "../../utils/constants"

export default function OTPScreen({ route, navigation }) {
  const { email, isRegistration = false } = route.params || {}
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef([])
  const { login } = useAuth()

  useEffect(() => {
    // Start countdown timer
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleOtpChange = (value, index) => {
    // Only allow numeric input
    const numericValue = value.replace(/[^0-9]/g, "")

    if (numericValue.length <= 1) {
      const newOtp = [...otp]
      newOtp[index] = numericValue
      setOtp(newOtp)

      // Auto-focus next input
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOTP = async () => {
    const otpString = otp.join("")

    if (otpString.length !== 6) {
      Alert.alert("Error", "Please enter the complete 6-digit OTP")
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.verifyOTP(email, otpString)

      if (response.success) {
        Alert.alert(
          "Success",
          isRegistration
            ? "Account created successfully!"
            : "OTP verified successfully!",
          [
            {
              text: "OK",
              onPress: () => {
                if (isRegistration) {
                  // For registration, navigate to login or directly login
                  navigation.navigate("Home")
                } else {
                  // For password reset or login OTP
                  navigation.navigate("Home")
                }
              },
            },
          ]
        )
      } else {
        Alert.alert("Error", response.message || "Invalid OTP")
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "OTP verification failed"
      Alert.alert("Error", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    setResendLoading(true)
    try {
      const response = await authAPI.resendOTP(email)

      if (response.success) {
        Alert.alert("Success", "OTP has been resent to your email")
        setTimer(60)
        setCanResend(false)
        setOtp(["", "", "", "", "", ""])

        // Restart timer
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              setCanResend(true)
              clearInterval(interval)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        Alert.alert("Error", response.message || "Failed to resend OTP")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Logo
            width={120}
            height={40}
          />
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons
                name='mail-outline'
                size={48}
                color='#4A90E2'
              />
            </View>
            <Text style={styles.welcomeTitle}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* OTP Input Form */}
          <View style={styles.form}>
            <Text style={styles.inputLabel}>Enter Verification Code</Text>

            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType='numeric'
                  maxLength={1}
                  textAlign='center'
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Timer and Resend */}
            <View style={styles.resendContainer}>
              {!canResend ? (
                <Text style={styles.timerText}>
                  Resend code in {formatTime(timer)}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={resendLoading}>
                  <Text style={styles.resendText}>
                    {resendLoading ? "Sending..." : "Resend Code"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.mainButton,
                (loading || otp.join("").length !== 6) && styles.buttonDisabled,
              ]}
              onPress={handleVerifyOTP}
              disabled={loading || otp.join("").length !== 6}>
              <Text style={styles.mainButtonText}>
                {loading ? "Verifying..." : "Verify & Continue"}
              </Text>
            </TouchableOpacity>

            {/* Footer Links */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.footerText}>
                  Wrong email? <Text style={styles.linkText}>Go back</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 0,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    gap: 20,
  },
  cardHeader: {
    alignItems: "center",
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f7ff",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "600",
    textAlign: "center",
  },
  form: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    backgroundColor: "#fff",
  },
  otpInputFilled: {
    borderColor: "#4A90E2",
    backgroundColor: "#f0f7ff",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  timerText: {
    fontSize: 14,
    color: "#666",
  },
  resendText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "600",
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
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  linkText: {
    color: "#4A90E2",
    fontWeight: "500",
  },
})
