import React, { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import { COLORS } from "../utils/constants"

interface Lead {
  _id: string
  name: string
  email: string
  message: string
  cardId: {
    _id: string
    name: string
    company: string
  }
  userId: string
  followUpStatus: "pending" | "contacted" | "completed"
  ipAddress: string
  userAgent: string
  submittedDate: string
}

interface LeadCardProps {
  lead: Lead
  onStatusUpdate: (
    leadId: string,
    newStatus: "pending" | "contacted" | "completed"
  ) => void
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, onStatusUpdate }) => {
  const [showActions, setShowActions] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#F59E0B"
      case "contacted":
        return "#10B981"
      case "completed":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "schedule"
      case "contacted":
        return "phone"
      case "completed":
        return "check-circle"
      default:
        return "help"
    }
  }

  const handleStatusChange = (
    newStatus: "pending" | "contacted" | "completed"
  ) => {
    Alert.alert(
      "Update Status",
      `Are you sure you want to mark this lead as ${newStatus}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Update",
          onPress: () => {
            onStatusUpdate(lead._id, newStatus)
            setShowActions(false)
          },
        },
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{lead.name}</Text>
          <Text style={styles.leadEmail}>{lead.email}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor(lead.followUpStatus)}20` },
          ]}
          onPress={() => setShowActions(!showActions)}
          activeOpacity={0.7}>
          <MaterialIcons
            name={getStatusIcon(lead.followUpStatus) as any}
            size={16}
            color={getStatusColor(lead.followUpStatus)}
          />
          <Text
            style={[
              styles.statusText,
              { color: getStatusColor(lead.followUpStatus) },
            ]}>
            {lead.followUpStatus.charAt(0).toUpperCase() +
              lead.followUpStatus.slice(1)}
          </Text>
          <MaterialIcons
            name={showActions ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={16}
            color={getStatusColor(lead.followUpStatus)}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.companyInfo}>
          <MaterialIcons
            name='business'
            size={16}
            color='#666'
          />
          <Text style={styles.companyText}>
            {lead.cardId.name} - {lead.cardId.company}
          </Text>
        </View>

        <View style={styles.messageContainer}>
          <Text style={styles.messageLabel}>Message:</Text>
          <Text
            style={styles.messageText}
            numberOfLines={3}>
            {lead.message}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dateContainer}>
            <Ionicons
              name='time'
              size={14}
              color='#999'
            />
            <Text style={styles.dateText}>
              {formatDate(lead.submittedDate)}
            </Text>
          </View>
        </View>
      </View>

      {showActions && (
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Update Status:</Text>
          <View style={styles.actionsButtons}>
            {["pending", "contacted", "completed"].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.actionButton,
                  lead.followUpStatus === status && styles.activeActionButton,
                  { borderColor: getStatusColor(status) },
                ]}
                onPress={() => handleStatusChange(status as any)}
                disabled={lead.followUpStatus === status}>
                <MaterialIcons
                  name={getStatusIcon(status) as any}
                  size={16}
                  color={
                    lead.followUpStatus === status
                      ? "#fff"
                      : getStatusColor(status)
                  }
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    lead.followUpStatus === status &&
                      styles.activeActionButtonText,
                    {
                      color:
                        lead.followUpStatus === status
                          ? "#fff"
                          : getStatusColor(status),
                    },
                  ]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

export default LeadCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 12,
  },
  leadInfo: {
    flex: 1,
    marginRight: 12,
  },
  leadName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  leadEmail: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  companyText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  actionsContainer: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  actionsButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  activeActionButton: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeActionButtonText: {
    color: "#fff",
  },
})
