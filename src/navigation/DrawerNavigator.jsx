import React from "react"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"
import MyCardScreen from "../screens/MyCardScreen"
import TeamCardsScreen from "../screens/TeamCardsScreen"
import BusinessCardsScreen from "../screens/BusinessCardsScreen"
import CustomDrawerContent from "../components/CustomDrawerContent"

const Drawer = createDrawerNavigator()

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#2196F3",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        drawerActiveTintColor: "#2196F3",
        drawerInactiveTintColor: "#666",
      }}>
      <Drawer.Screen
        name='MyCard'
        component={MyCardScreen}
        options={{
          title: "My Card",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name='person'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name='TeamCards'
        component={TeamCardsScreen}
        options={{
          title: "Team Cards",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name='people'
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name='BusinessCards'
        component={BusinessCardsScreen}
        options={{
          title: "Business Cards",
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name='business'
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  )
}
