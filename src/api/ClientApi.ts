const BASE_URL = "http://192.168.3.172:5000/api"

export const endpoints = {
  // Leads endpoints
  getLeads: `${BASE_URL}/leads/my-leads`,
  updateLeadStatus: (id: string) => `${BASE_URL}/leads/${id}/status`,

  // My Card endpoints
  getUserBusinessCards: `${BASE_URL}/business-cards/user`,
  updateBusinessCard: (id: string) => `${BASE_URL}/business-cards/${id}`,
  createBusinessCard: `${BASE_URL}/business-cards`,

  // Saved Cards endpoints
  getSavedCards: `${BASE_URL}/business-cards/saved`,
  unsaveCard: (id: string) => `${BASE_URL}/business-cards/saved/${id}`,

  // Team Cards endpoints
  getTeamCards: `${BASE_URL}/team-card`,
  deleteTeamCard: (id: string) => `${BASE_URL}/team-card/${id}`,

  // Business Cards endpoints
  getBusinessCards: `${BASE_URL}/business-cards`,
  deleteBusinessCard: (id: string) => `${BASE_URL}/business-cards/${id}`,
  
};
