import { useEffect } from "react"
import { makeRedirectUri, useAuthRequest } from "expo-auth-session"
import * as WebBrowser from "expo-web-browser"

WebBrowser.maybeCompleteAuthSession()

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
}

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId:
        "927800798267-osn2cmpqovt0rnmh6aspnrte5clf54o4.apps.googleusercontent.com", // Same as in your backend
      scopes: ["openid", "profile", "email"],
      redirectUri: makeRedirectUri({
        scheme: "com.connectree.mobile",
      }),
    },
    discovery
  )

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response
      handleGoogleAuthSuccess(authentication)
    }
  }, [response])

  const handleGoogleAuthSuccess = async (authentication) => {
    try {
      // Send the access token to your backend
      const response = await fetch(
        "https:/connectree.co/api//auth/google/mobile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken: authentication.accessToken,
          }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        // Store the JWT token and navigate to home
        // You'll need to implement token storage (AsyncStorage)
        return { success: true, token: data.token, user: data.user }
      } else {
        return { success: false, error: data.message }
      }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  return {
    request,
    response,
    promptAsync,
  }
}
