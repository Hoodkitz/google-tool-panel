// API Configuration for Remote Server
// This file configures where the frontend connects to the backend

// Default to localhost for development
// Override with NEXT_PUBLIC_API_URL for production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    vpn: `${API_BASE_URL}/api/vpn/toggle`,
    overwatch: `${API_BASE_URL}/api/overwatch`,
    terminal: `${API_BASE_URL}/api/terminal`,
    selfImprovement: `${API_BASE_URL}/api/self-improvement`,
    generateIcons: `${API_BASE_URL}/api/generate-icons`,
  }
}

export function getApiUrl(endpoint: keyof typeof API_CONFIG.endpoints): string {
  return API_CONFIG.endpoints[endpoint]
}

// Helper function for API calls
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  return response
}
