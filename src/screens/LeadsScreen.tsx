import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native"
import { MaterialIcons, Ionicons } from "@expo/vector-icons"
import axios from "axios"
import { useAuth } from "../context/AuthContext"
import LeadCard from "../components/LeadCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { COLORS } from "../utils/constants"
import Header from "../components/Header"

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

interface LeadStats {
  total: number
  contacted: number
  pending: number
  completed: number
}

const API_BASE_URL = "http://192.168.3.172:5000/api"

export default function LeadsScreen() {
  const { user, token } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [stats, setStats] = useState<LeadStats>({
    total: 0,
    contacted: 0,
    pending: 0,
    completed: 0,
  })

  const filterOptions = [
    { label: "All Leads", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Contacted", value: "contacted" },
    { label: "Completed", value: "completed" },
  ]

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [leads, searchQuery, selectedFilter])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/leads/my-leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data?.success && response.data?.leads) {
        const leadsData = response.data.leads
        setLeads(leadsData)
        calculateStats(leadsData)
      } else {
        setLeads([])
        setStats({ total: 0, contacted: 0, pending: 0, completed: 0 })
      }
    } catch (error) {
      console.error("Error fetching leads:", error)
      Alert.alert(
        "Error",
        "Failed to fetch leads. Please check your connection and try again."
      )
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (leadsData: Lead[]) => {
    const newStats = {
      total: leadsData.length,
      contacted: leadsData.filter((lead) => lead.followUpStatus === "contacted")
        .length,
      pending: leadsData.filter((lead) => lead.followUpStatus === "pending")
        .length,
      completed: leadsData.filter((lead) => lead.followUpStatus === "completed")
        .length,
    }
    setStats(newStats)
  }

  const applyFilters = () => {
    let filtered = leads

    // Apply status filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(
        (lead) => lead.followUpStatus === selectedFilter
      )
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          lead.email.toLowerCase().includes(query) ||
          lead.cardId.name.toLowerCase().includes(query) ||
          lead.cardId.company.toLowerCase().includes(query)
      )
    }

    setFilteredLeads(filtered)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchLeads()
    setRefreshing(false)
  }

  const handleStatusUpdate = (
    leadId: string,
    newStatus: "pending" | "contacted" | "completed"
  ) => {
    const updatedLeads = leads.map((lead) =>
      lead._id === leadId ? { ...lead, followUpStatus: newStatus } : lead
    )
    setLeads(updatedLeads)
    calculateStats(updatedLeads)
  }

  const StatCard = ({
    title,
    count,
    icon,
    color,
    onPress,
  }: {
    title: string
    count: number
    icon: string
    color: string
    onPress?: () => void
  }) => (
    <TouchableOpacity
      style={styles.statCard}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.statCardHeader}>
        <MaterialIcons
          name={icon as any}
          size={24}
          color={color}
        />
        <Text style={styles.statCount}>{count}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialIcons
              name='people'
              size={32}
              color={COLORS.primary}
              style={styles.titleIcon}
            />
            <Text style={styles.headerTitle}>Leads</Text>
          </View>
          <Text style={styles.subtitle}>
            {stats.total > 0
              ? `Managing ${stats.total} lead${stats.total !== 1 ? "s" : ""}`
              : "No leads yet"}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      {!loading ? (
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <StatCard
                  title='Total Leads'
                  count={stats.total}
                  icon='people'
                  color='#3B82F6'
                  onPress={() => {
                    setSelectedFilter("all")
                    setSearchQuery("")
                  }}
                />
                <StatCard
                  title='Contacted'
                  count={stats.contacted}
                  icon='phone'
                  color='#10B981'
                  onPress={() => {
                    setSelectedFilter("contacted")
                    setSearchQuery("")
                  }}
                />
              </View>
              <View style={styles.statsRow}>
                <StatCard
                  title='Pending'
                  count={stats.pending}
                  icon='schedule'
                  color='#F59E0B'
                  onPress={() => {
                    setSelectedFilter("pending")
                    setSearchQuery("")
                  }}
                />
                <StatCard
                  title='Completed'
                  count={stats.completed}
                  icon='check-circle'
                  color='#EF4444'
                  onPress={() => {
                    setSelectedFilter("completed")
                    setSearchQuery("")
                  }}
                />
              </View>
            </View>

            {/* Search and Filter Section */}
            <View style={styles.searchFilterContainer}>
              <View style={styles.searchContainer}>
                <Ionicons
                  name='search'
                  size={20}
                  color='#666'
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder='Search leads by name, email, or company...'
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor='#999'
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    style={styles.clearButton}>
                    <Ionicons
                      name='close-circle'
                      size={20}
                      color='#666'
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.filterContainer}>
                <TouchableOpacity
                  style={styles.filterButton}
                  onPress={() => setShowFilterDropdown(!showFilterDropdown)}
                  activeOpacity={0.7}>
                  <MaterialIcons
                    name='filter-list'
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.filterButtonText}>
                    {
                      filterOptions.find((opt) => opt.value === selectedFilter)
                        ?.label
                    }
                  </Text>
                  <MaterialIcons
                    name={
                      showFilterDropdown
                        ? "keyboard-arrow-up"
                        : "keyboard-arrow-down"
                    }
                    size={20}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>

                {showFilterDropdown && (
                  <View style={styles.filterDropdown}>
                    {filterOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.filterOption,
                          selectedFilter === option.value &&
                            styles.selectedFilterOption,
                        ]}
                        onPress={() => {
                          setSelectedFilter(option.value)
                          setShowFilterDropdown(false)
                        }}>
                        <Text
                          style={[
                            styles.filterOptionText,
                            selectedFilter === option.value &&
                              styles.selectedFilterOptionText,
                          ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Leads List */}
            <View style={styles.leadsContainer}>
              {filteredLeads.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialIcons
                    name='inbox'
                    size={64}
                    color='#ccc'
                  />
                  <Text style={styles.emptyText}>
                    {searchQuery || selectedFilter !== "all"
                      ? "No leads match your search criteria"
                      : "No leads found. Start promoting your business card to generate leads!"}
                  </Text>
                </View>
              ) : (
                filteredLeads.map((lead) => (
                  <LeadCard
                    key={lead._id}
                    lead={lead}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <LoadingSpinner />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleIcon: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statCount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  statTitle: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  searchFilterContainer: {
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    position: "relative",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "500",
  },
  filterDropdown: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedFilterOption: {
    backgroundColor: "#f0f8ff",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedFilterOptionText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  leadsContainer: {
    gap: 16,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 24,
  },
})
