import { Linking, Alert, Platform, Share, PermissionsAndroid } from "react-native"
import RNFS from 'react-native-fs';
import { postData } from "@api/apiServices";
import { endpoints } from "@api/ClientApi";
/**
 * Handles opening social media links with native app preference and web fallback
 */
export const handleSocialMediaPress = async (
  url: string | undefined,
  platform: string
) => {
  if (!url || url.trim() === "") {
    Alert.alert("No Link", `No ${platform} profile linked`)
    return
  }

  try {
    // Normalize to a valid web URL fallback
    let webUrl = url
    if (!webUrl.startsWith("http://") && !webUrl.startsWith("https://")) {
      webUrl = `https://${webUrl}`
    }

    // Prepare candidate deep links for native apps
    const candidates: string[] = []
    
    // If the URL itself hints the platform, prefer that
    let lower = platform.toLowerCase()
    if (webUrl.includes("linkedin.com")) lower = "linkedin"
    if (webUrl.includes("instagram.com")) lower = "instagram"
    if (webUrl.includes("twitter.com") || webUrl.includes("x.com")) lower = "twitter"
    if (webUrl.includes("youtube.com") || webUrl.includes("youtu.be")) lower = "youtube"
    if (webUrl.includes("facebook.com") || webUrl.includes("fb.com")) lower = "facebook"

    // Extract identifiers from URL for deep linking
    const getMatch = (pattern: RegExp): string | null => {
      const m = webUrl.match(pattern)
      return m && m[1] ? m[1] : null
    }

    if (lower === "facebook") {
      // Facebook URL patterns:
      // https://www.facebook.com/profile.php?id=123456789
      // https://www.facebook.com/username
      // https://www.facebook.com/pages/PageName/123456789
      
      // Extract numeric ID from profile.php?id= URLs
      const numericId = getMatch(/facebook\.com\/profile\.php\?id=([0-9]+)/i)
      
      // Extract username from direct profile URLs
      const username = getMatch(/facebook\.com\/([A-Za-z0-9._-]+)(?:\?|$)/i)
      
      // Extract page ID from pages URLs
      const pageId = getMatch(/facebook\.com\/pages\/[^\/]+\/([0-9]+)/i)
      
      if (numericId) {
        // Use numeric ID for deep linking
        candidates.push(`fb://profile/${numericId}`)
      } else if (pageId) {
        // Use page ID for deep linking
        candidates.push(`fb://page/${pageId}`)
      } else if (username && !username.includes('pages') && !username.includes('profile.php')) {
        // Use username for deep linking (filter out 'pages' and 'profile.php' false matches)
        candidates.push(`fb://profile/${username}`)
      }
      
      // Fallback to opening Facebook app
      candidates.push("fb://")

    } else if (lower === "instagram") {
      // e.g., https://www.instagram.com/{username}
      const username =
        getMatch(/instagram\.com\/(?:[^\/]+\/)?([A-Za-z0-9_.]+)/i) ||
        getMatch(/instagram\.com\/([A-Za-z0-9_.]+)/i)
      if (username) {
        candidates.push(`instagram://user?username=${username}`)
      } else {
        candidates.push("instagram://app")
      }

    } else if (lower === "twitter" || lower === "x") {
      // e.g., https://twitter.com/{handle} or https://x.com/{handle}
      const handle = getMatch(/(?:twitter|x)\.com\/([A-Za-z0-9_]+)/i)
      if (handle) {
        candidates.push(`twitter://user?screen_name=${handle}`)
      } else {
        candidates.push("twitter://timeline")
      }

    } else if (lower === "linkedin") {
      // Extract username from LinkedIn URL: https://www.linkedin.com/in/{username}
      const username = getMatch(/linkedin\.com\/in\/([A-Za-z0-9-_%]+)/i)
      if (username) {
        candidates.push(`linkedin://in/${username}`)
      }

    } else if (lower === "youtube") {
      // Channels: https://www.youtube.com/channel/{id}
      // Users: https://www.youtube.com/@handle
      // Videos: https://www.youtube.com/watch?v={id}
      const channelId = getMatch(/youtube\.com\/channel\/([A-Za-z0-9_-]+)/i)
      const videoId = getMatch(/[?&]v=([A-Za-z0-9_-]{6,})/i)
      const handle = getMatch(/youtube\.com\/(@[A-Za-z0-9_\.\-]+)/i)
      
      if (videoId) {
        // Prefer platform-specific schemes
        candidates.push(
          Platform.OS === "android"
            ? `vnd.youtube://${videoId}`
            : `youtube://watch?v=${videoId}`
        )
      }
      if (channelId) {
        candidates.push(`youtube://www.youtube.com/channel/${channelId}`)
      }
      if (handle) {
        candidates.push(`youtube://www.youtube.com/${handle}`)
      }
      candidates.push("youtube://")
    }

    // Simple LinkedIn handling for Android
    if (lower === "linkedin" && Platform.OS === "android") {
      console.log("LinkedIn web URL:", webUrl) // Debug log
      // 1. Try opening the web URL - Android App Links will route to LinkedIn app if installed
      try {
        console.log("Trying web URL (App Links):", webUrl) // Debug log
        await Linking.openURL(webUrl)
        console.log("Successfully opened web URL") // Debug log
        return // Successfully opened, exit function
      } catch (error) {
        console.log("Failed to open web URL:", error) // Debug log
      }

      // 2. If web URL failed, LinkedIn app likely not installed - go to Play Store
      console.log("Web URL failed, going to Play Store") // Debug log
      try {
        await Linking.openURL("market://details?id=com.linkedin.android")
      } catch (_) {}
      return // Always exit here for LinkedIn on Android
    }

    let handled = false
    if (!handled) {
      for (const appUrl of candidates) {
        try {
          const can = await Linking.canOpenURL(appUrl)
          if (can) {
            await Linking.openURL(appUrl)
            handled = true
            break
          }
        } catch (_) {
          // try next candidate
        }
      }
    }

    if (handled) return

    // Fallback: open in browser (attempt directly even if canOpenURL returns false)
    try {
      await Linking.openURL(webUrl)
    } catch (e) {
      // As a last resort, try with http if https failed (rare)
      if (webUrl.startsWith("https://")) {
        const httpUrl = webUrl.replace("https://", "https://")
        try {
          await Linking.openURL(httpUrl)
          return
        } catch (e2) {
          Alert.alert("Error", `Cannot open ${platform} link`)
        }
      } else {
        Alert.alert("Error", `Cannot open ${platform} link`)
      }
    }
  } catch (error) {
    console.error("Error opening URL:", error)
    Alert.alert("Error", `Failed to open ${platform} link`)
  }
}

/**
 * Handles opening phone dialer with the provided phone number
 */
export const handlePhonePress = async (phoneNumber: string | undefined) => {
  if (
    !phoneNumber ||
    phoneNumber.trim() === "" ||
    phoneNumber === "No phone number" ||
    phoneNumber === "No business phone"
  ) {
    Alert.alert("No Phone", "No phone number available")
    return
  }

  try {
    const phoneUrl = `tel:${phoneNumber.replace(/\s+/g, "")}`
    await Linking.openURL(phoneUrl)
  } catch (error) {
    console.error("Error opening dialer:", error)
    Alert.alert("Error", "Failed to open dialer")
  }
}

/**
 * Handles opening email app with the provided email address
 */
export const handleEmailPress = async (email: string | undefined) => {
  if (
    !email ||
    email.trim() === "" ||
    email === "No email" ||
    email === "No business email"
  ) {
    Alert.alert("No Email", "No email address available")
    return
  }

  try {
    const emailUrl = `mailto:${email}`
    await Linking.openURL(emailUrl)
  } catch (error) {
    console.error("Error opening email:", error)
    Alert.alert("Error", "Failed to open email app")
  }
}

/**
 * Handles opening map app with the provided address
 */
export const handleLocationPress = async (address: string | undefined) => {
  if (
    !address ||
    address.trim() === "" ||
    address === "Location not provided"
  ) {
    Alert.alert("No Location", "No address available")
    return
  }

  try {
    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address)

    // Try different map URL schemes
    const mapUrls = [
      // Google Maps (works on both platforms)
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      // Platform specific fallbacks
      Platform.OS === "ios"
        ? `http://maps.apple.com/?q=${encodedAddress}`
        : `geo:0,0?q=${encodedAddress}`,
    ]

    // Try each URL until one works
    for (const mapUrl of mapUrls) {
      try {
        await Linking.openURL(mapUrl)
        return // Successfully opened, exit function
      } catch (_) {
        // Continue to next URL
      }
    }

    // If all map URLs failed, fallback to web search
    await Linking.openURL(`https://www.google.com/search?q=${encodedAddress}`)
  } catch (error) {
    console.error("Error opening map:", error)
    Alert.alert("Error", "Failed to open map")
  }
}

/**
 * Handles sharing functionality (placeholder for now)
 */
export const handleShare = async (id: string) => {
  try {
    if (!id) {
      Alert.alert("Id Empty")
      return
    }
    const url = `https://connectree.co/preview/card/${id}`
    await Share.share({
      message: `https://connectree.co/preview/card/${id}`,
      url: url,
      title: "Business Card Preview",
    })
  } catch (error) {
    Alert.alert("Error", error?.message)
  }
}


export const handleSaveVCard = async (businessCard: any) => {

 try {
    // Permission request needed for Android 6+
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'Need permission to save vCard to your device',
          buttonPositive: 'OK',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Permission denied', 'Cannot save vCard without permission');
        return;
      }
    }

    const vcard = `BEGIN:VCARD
                  VERSION:3.0
                  FN:${businessCard.name || ''}
                  ORG:${businessCard.company || ''}
                  TEL;TYPE=WORK,VOICE:${businessCard.phone || ''}
                  EMAIL;TYPE=WORK:${businessCard.email || ''}
                  END:VCARD`;

    // Path to Downloads
    const downloadPath = Platform.OS === 'android' ? RNFS.ExternalDirectoryPath : RNFS.DocumentDirectoryPath;
    const filePath = `${downloadPath}/${businessCard.name}.vcf`;

    // Write vCard to downloads
    await RNFS.writeFile(filePath, vcard, 'utf8');

    Alert.alert('Success', `vCard saved to Downloads: FileManager/Downloads/${businessCard?.name}.vcf`);
  } catch (error) {
    Alert.alert('Error', error.message);
  }

}

  // Send Card handler
  // const handleSendCard = async () => {
  //   try {
  //     await sendCard(user?.id, businessCard?.userid?.id || businessCard?.userid)
  //     Alert.alert("Success", "Card sent successfully")
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to send card")
  //   }
  // }

export const handleSendCard = async (senderId,recipientId) => {
  try {
    const response = await postData(endpoints.sendMyCard,
      {
        senderId,
        recipientId
      }
    )

    if (response.status === 200) {
      Alert.alert('Success', 'Card sent successfully');
    } else {
      Alert.alert('Failed', 'Failed to send card');
    }
  } catch (error) {
    Alert.alert('Error', 'An error occurred while sending the card');
    console.error(error);
  }
};