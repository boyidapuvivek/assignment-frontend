import React from "react"
import { View, Text } from "react-native"

export default function TeamCardsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Working</Text>
    </View>
  )
}

// import React, { useState, useEffect } from "react"
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native"
// import { Ionicons, MaterialIcons } from "@expo/vector-icons"
// import { cardAPI } from "../utils/api"
// import CardForm from "../components/CardForm"
// import CardList from "../components/CardList"
// import LoadingSpinner from "../components/LoadingSpinner"
// import { COLORS } from "../utils/constants"

// export default function TeamCardsScreen() {
//   const [teamCards, setTeamCards] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [isCreating, setIsCreating] = useState(false)

//   useEffect(() => {
//     fetchTeamCards()
//   }, [])

//   const fetchTeamCards = async () => {
//     try {
//       const response = await cardAPI.getTeamCards()
//       setTeamCards(response.data)
//     } catch (error) {
//       Alert.alert("Error", "Failed to fetch team cards")
//     } finally {
//       setLoading(false)
//     }
//   }

//   // CORRECTED: Fixed the handleCreateCard function
//   const handleCreateCard = async (formData, imageFiles) => {
//     setLoading(true)
//     try {
//       // For TeamCardsScreen - use createTeamCard
//       await cardAPI.createTeamCard(formData, imageFiles)
//       setIsCreating(false)
//       fetchTeamCards() // Correct function call for team cards
//       Alert.alert("Success", "Team member created successfully!")
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to create team member"
//       )
//     } finally {
//       setLoading(false) // Fixed: moved to finally block
//     }
//   }

//   const handleDeleteCard = async (cardId) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this team member?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await cardAPI.deleteTeamCard(cardId)
//               fetchTeamCards()
//               Alert.alert("Success", "Team member deleted successfully!")
//             } catch (error) {
//               Alert.alert("Error", "Failed to delete team member")
//             }
//           },
//         },
//       ]
//     )
//   }

//   if (loading && !isCreating) {
//     return <LoadingSpinner />
//   }

//   return (
//     <View style={styles.container}>
//       Header Section
//       <View style={styles.headerContainer}>
//         <View style={styles.header}>
//           <View style={styles.titleContainer}>
//             <MaterialIcons
//               name='group'
//               size={28}
//               color='#2196F3'
//               style={styles.titleIcon}
//             />
//             <Text style={styles.title}>Team Business Cards</Text>
//           </View>
//           <Text style={styles.subtitle}>Manage your team member cards</Text>

//           {!isCreating && (
//             <TouchableOpacity
//               style={styles.newCard}
//               onPress={() => setIsCreating(true)}
//               activeOpacity={0.8}>
//               <View style={styles.addButton}>
//                 <Ionicons
//                   name='add'
//                   size={20}
//                   color='#fff'
//                 />
//               </View>
//               <Text style={styles.newCardText}>Add New Member</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* Content Section */}
//       <View style={styles.contentWrapper}>
//         <View style={styles.dataContainer}>
//           {isCreating ? (
//             <View style={styles.formContainer}>
//               <CardForm
//                 onSave={handleCreateCard}
//                 onCancel={() => setIsCreating(false)}
//                 showCancel={true}
//                 isCreating={true}
//                 title='Create Team Member'
//               />
//             </View>
//           ) : (
//             <View style={styles.listContainer}>
//               <CardList
//                 cards={teamCards}
//                 onDelete={handleDeleteCard}
//                 type='team'
//               />
//             </View>
//           )}
//         </View>
//       </View>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   headerContainer: {
//     backgroundColor: COLORS.white,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 3,
//     zIndex: 1,
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingTop: 25,
//     paddingBottom: 20,
//     alignItems: "center",
//   },
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   titleIcon: {
//     marginRight: 12,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#1a1a1a",
//     letterSpacing: 0.5,
//   },
//   subtitle: {
//     fontSize: 15,
//     color: "#6b7280",
//     marginBottom: 20,
//     textAlign: "center",
//     fontWeight: "500",
//   },
//   newCard: {
//     width: "90%",
//     height: 56,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: COLORS.primary,
//     borderRadius: 16,
//     paddingHorizontal: 20,
//     shadowColor: COLORS.primary,
//     shadowOffset: {
//       width: 0,
//       height: 4,
//     },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//     marginBottom: 5,
//   },
//   addButton: {
//     width: 36,
//     height: 36,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255, 255, 255, 0.25)",
//     borderRadius: 18,
//     marginRight: 15,
//   },
//   newCardText: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: COLORS.white,
//     letterSpacing: 0.3,
//   },
//   contentWrapper: {
//     flex: 1,
//     backgroundColor: "#f8f9fa",
//   },
//   dataContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 20,
//   },
//   formContainer: {
//     flex: 1,
//     backgroundColor: COLORS.white,
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   listContainer: {
//     flex: 1,
//   },
// })
