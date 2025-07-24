// Xano API Configuration
const XANO_API_BASE = process.env.NEXT_PUBLIC_XANO_API_URL || '';

// Mock data for development - empty array to use real Xano data
const MOCK_CLIENTS: Client[] = [];

const MOCK_PROTOCOLS: Protocol[] = [
  {
    id: 1,
    name: 'Standard Wellness Protocol',
    description: 'Basic wellness protocol for general health improvement',
    content: 'Protocol content here...',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    name: 'Advanced Recovery Protocol',
    description: 'Enhanced protocol for post-injury recovery',
    content: 'Advanced protocol content...',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 3,
    name: 'Senior Wellness Protocol',
    description: 'Specialized protocol for senior citizens',
    content: 'Senior protocol content...',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
];

// Check if we should use mock data - Always use real API if base URL is set
const useMockData = !XANO_API_BASE;

export interface Client {
  id?: number;
  providers_id: number;  // Changed to match Xano (integer, not string)
  email: string;  // Client email for document linking
  first_name: string;
  last_name: string;
  condition?: string;
  intake_type?: string;
  map_pdf_url?: string;
  cec_result?: any;  // JSON type
  nfb_protocol?: number;  // 1-12
  notes?: string;  // Client notes
  created_at?: string;
  updated_at?: string;
}

export interface Provider {
  id?: number;  // Changed to number to match Xano
  memberstack_id?: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  practice?: string;
  practice_type?: string;
  role: 'provider' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface Protocol {
  id: number;
  name: string;
  description: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ClientDocument {
  id: number;
  clients_id: number;  // Note: clients_id not client_id
  document_type: string;
  file_url: string;
  file_name: string;
  uploaded_by: number;
  created_at: number;
  updated_at?: number;
}

export interface ClientProtocolHistory {
  id: number;
  client_id: number;
  protocol_id: number;
  assigned_by: string;
  assigned_at: string;
  notes?: string;
}

export interface SharedLink {
  id: string;
  client_id: number;
  protocol_id: number;
  token: string;
  message?: string;
  expires_at: string;
  created_at: string;
  accessed_at?: string;
  access_count: number;
}

// Helper function to get auth token from Memberstack
const getAuthToken = async () => {
  if (typeof window !== 'undefined' && (window as any).memberstack) {
    const memberstack = (window as any).memberstack;
    const member = await memberstack.getCurrentMember();
    return member?.auth?.token || null;
  }
  return null;
};

// Create headers - Xano uses public endpoints or user auth tokens, not API keys
const getHeaders = async () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Note: If your Xano endpoints require authentication,
  // you'll need to implement login flow to get auth tokens
  
  return headers;
};

// Simple in-memory cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 seconds cache

// Fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

// Client API functions
export const clientAPI = {
  // Get all clients for the current provider
  async getClients(providerId?: number) {
    if (useMockData) {
      // Return mock data for development
      return providerId 
        ? MOCK_CLIENTS.filter(c => c.providers_id === providerId)
        : MOCK_CLIENTS;
    }
    
    try {
      console.log('Fetching clients for provider ID:', providerId);
      
      // Make sure we only get clients with the specific provider ID
      if (!providerId) {
        console.log('No provider ID provided, returning empty array');
        return [];
      }
      
      const queryParam = `?providers_id=${providerId}`;
      const url = `${XANO_API_BASE}/clients${queryParam}`;
      const cacheKey = `clients:${providerId}`;
      
      // Check cache first
      const cached = apiCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Returning cached clients data');
        return cached.data;
      }
      
      console.log('Clients request URL:', url);
      const headers = await getHeaders();
      
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers,
      }, 10000); // 10 second timeout
      
      console.log('Clients response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Clients fetch error:', errorText);
        throw new Error('Failed to fetch clients');
      }
      
      const data = await response.json();
      console.log('Raw clients data:', data);
      
      // Filter out any clients that don't have the matching provider ID
      // and exclude invalid/empty clients
      const filteredClients = Array.isArray(data) 
        ? data.filter(client => 
            client.providers_id === providerId && 
            client.first_name && 
            client.last_name &&
            client.email
          )
        : [];
      
      console.log(`Filtered clients: ${filteredClients.length} out of ${data.length} total`);
      
      // Cache the filtered results
      apiCache.set(cacheKey, { data: filteredClients, timestamp: Date.now() });
      
      return filteredClients;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Get a single client by ID
  async getClient(clientId: string) {
    if (useMockData) {
      // Return mock data for development
      return MOCK_CLIENTS.find(c => c.id === parseInt(clientId)) || null;
    }
    
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/clients/${clientId}`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch client');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  },

  // Create a new client
  async createClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    if (useMockData) {
      // Create mock client for development
      const newClient: Client = {
        ...client,
        id: Math.floor(Math.random() * 10000),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      // In a real app, you'd add this to the mock data array
      MOCK_CLIENTS.push(newClient);
      return newClient;
    }
    
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/clients`, {
        method: 'POST',
        headers,
        body: JSON.stringify(client),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create client');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Update a client
  async updateClient(clientId: string, updates: Partial<Client>) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/clients/${clientId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update client');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Delete a client
  async deleteClient(clientId: string) {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/clients/${clientId}`, {
        method: 'DELETE',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete client');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  },

  // Upload PDF for client
  async uploadClientPDF(clientId: string, file: File) {
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('client_id', clientId);
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${XANO_API_BASE}/clients/${clientId}/upload-pdf`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload PDF');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  },

  // Upload PDF to Xano MAPS_PDF endpoint with client information
  async uploadMapsPDF(file: File, clientEmail: string, firstName: string, lastName: string): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      // New client documents system parameters
      formData.append('content', file);
      formData.append('client_email', clientEmail);
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      
      console.log('Uploading PDF for client:', { clientEmail, firstName, lastName });
      
      // Don't set Content-Type header when sending FormData
      // Browser will set it automatically with boundary
      const response = await fetch(`${XANO_API_BASE}/MAPS_PDF`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('MAPS_PDF upload error:', errorText);
        throw new Error(`Failed to upload PDF: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('PDF upload result:', result);
      // Return the file URL from the response
      return { url: result.file_url || result.url || '' };
    } catch (error) {
      console.error('Error uploading MAPS PDF:', error);
      throw error;
    }
  },

  // Get client documents by client ID
  async getClientDocuments(clientId: number): Promise<ClientDocument[]> {
    try {
      const headers = await getHeaders();
      // Fetch all documents and filter by client ID since API doesn't support filtering
      const url = `${XANO_API_BASE}/client_documents`;
      console.log('Fetching all client documents from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });
      
      console.log('Documents response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Client documents fetch error:', errorText);
        return [];
      }
      
      const data = await response.json();
      console.log('All client documents data:', data);
      
      // Filter by client ID
      const filteredData = Array.isArray(data)
        ? data.filter(doc => doc.clients_id === clientId)
        : [];
      
      console.log(`Filtered documents for client ID ${clientId}:`, filteredData);
      return filteredData;
    } catch (error) {
      console.error('Error fetching client documents:', error);
      return [];
    }
  },

  // Create or update client with upsert logic similar to provider
  async upsertClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) {
    if (useMockData) {
      // Create mock client for development
      const newClient: Client = {
        ...client,
        id: Math.floor(Math.random() * 10000),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return newClient;
    }
    
    try {
      const headers = await getHeaders();
      console.log('Attempting to upsert client:', client);
      
      // First, try to find existing client by first_name, last_name, and providers_id
      const searchParams = new URLSearchParams({
        first_name: client.first_name,
        last_name: client.last_name,
        providers_id: client.providers_id.toString()
      });
      
      const searchResponse = await fetch(`${XANO_API_BASE}/clients?${searchParams}`, {
        method: 'GET',
        headers,
      });
      
      let existingClient = null;
      if (searchResponse.ok) {
        const clients = await searchResponse.json();
        if (Array.isArray(clients) && clients.length > 0) {
          existingClient = clients[0];
          console.log('Found existing client:', existingClient);
        }
      }
      
      if (existingClient) {
        // Update existing client
        console.log('Updating existing client with ID:', existingClient.id);
        const updateResponse = await fetch(`${XANO_API_BASE}/clients/${existingClient.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(client),
        });
        
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error('Xano API error response:', errorText);
          throw new Error(`Failed to update client: ${updateResponse.status} - ${errorText}`);
        }
        
        return await updateResponse.json();
      } else {
        // Create new client
        console.log('Creating new client');
        const createResponse = await fetch(`${XANO_API_BASE}/clients`, {
          method: 'POST',
          headers,
          body: JSON.stringify(client),
        });
        
        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error('Xano API error response:', errorText);
          throw new Error(`Failed to create client: ${createResponse.status} - ${errorText}`);
        }
        
        return await createResponse.json();
      }
    } catch (error) {
      console.error('Error creating/updating client:', error);
      throw error;
    }
  },
};

// Protocol API functions
export const protocolAPI = {
  // Get all protocols
  async getProtocols() {
    if (useMockData) {
      return MOCK_PROTOCOLS;
    }
    
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/protocols`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch protocols');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching protocols:', error);
      throw error;
    }
  },

  // Get a single protocol by ID
  async getProtocol(protocolId: number) {
    if (useMockData) {
      return MOCK_PROTOCOLS.find(p => p.id === protocolId) || null;
    }
    
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/protocols/${protocolId}`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch protocol');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching protocol:', error);
      throw error;
    }
  },

  // Get client protocol history
  async getClientProtocolHistory(clientId: string) {
    if (useMockData) {
      // Return mock history
      return [
        {
          id: 1,
          client_id: parseInt(clientId),
          protocol_id: 1,
          assigned_by: 'provider-1',
          assigned_at: '2024-01-15T10:00:00Z',
          notes: 'Initial protocol assignment',
        },
        {
          id: 2,
          client_id: parseInt(clientId),
          protocol_id: 2,
          assigned_by: 'provider-1',
          assigned_at: '2024-02-10T14:00:00Z',
          notes: 'Updated to advanced recovery protocol',
        },
      ].filter(h => h.client_id === parseInt(clientId));
    }
    
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/clients/${clientId}/protocol-history`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch protocol history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching protocol history:', error);
      throw error;
    }
  },

  // Create a shareable link
  async createShareableLink(clientId: number, protocolId: number, message?: string) {
    if (useMockData) {
      // Return mock shareable link
      return {
        id: 'mock-link-id',
        client_id: clientId,
        protocol_id: protocolId,
        token: 'mock-token-' + Date.now(),
        message: message,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        created_at: new Date().toISOString(),
        access_count: 0,
        share_url: `${window.location.origin}/shared/mock-token-${Date.now()}`,
      };
    }
    
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/share-link`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          client_id: clientId,
          protocol_id: protocolId,
          message: message,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create shareable link');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating shareable link:', error);
      throw error;
    }
  },
};

// Provider API functions
export const providerAPI = {
  // Create or update a provider
  async upsertProvider(provider: Omit<Provider, 'id' | 'created_at' | 'updated_at'>) {
    if (useMockData) {
      // Return mock provider for development
      return {
        ...provider,
        id: 1,  // Mock provider ID as number
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    
    try {
      const headers = await getHeaders();
      console.log('Attempting to upsert provider:', provider);
      
      // First, try to find existing provider by email
      const searchResponse = await fetch(`${XANO_API_BASE}/providers?email=${encodeURIComponent(provider.email)}`, {
        method: 'GET',
        headers,
      });
      
      let existingProvider = null;
      if (searchResponse.ok) {
        const providers = await searchResponse.json();
        if (Array.isArray(providers) && providers.length > 0) {
          existingProvider = providers[0];
          console.log('Found existing provider:', existingProvider);
        }
      }
      
      if (existingProvider) {
        // Update existing provider
        console.log('Updating existing provider with ID:', existingProvider.id);
        const updateResponse = await fetch(`${XANO_API_BASE}/providers/${existingProvider.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            ...provider,
            memberstack_id: provider.memberstack_id, // Make sure to set the memberstack_id
          }),
        });
        
        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error('Xano API error response:', errorText);
          throw new Error(`Failed to update provider: ${updateResponse.status} - ${errorText}`);
        }
        
        return await updateResponse.json();
      } else {
        // Create new provider
        console.log('Creating new provider');
        const createResponse = await fetch(`${XANO_API_BASE}/providers`, {
          method: 'POST',
          headers,
          body: JSON.stringify(provider),
        });
        
        if (!createResponse.ok) {
          const errorText = await createResponse.text();
          console.error('Xano API error response:', errorText);
          throw new Error(`Failed to create provider: ${createResponse.status} - ${errorText}`);
        }
        
        return await createResponse.json();
      }
    } catch (error) {
      console.error('Error creating/updating provider:', error);
      throw error;
    }
  },

  // Get provider by email
  async getProviderByEmail(email: string) {
    if (useMockData) {
      return {
        id: 1,  // Mock provider ID as number
        memberstack_id: 'mock-memberstack-id',
        first_name: 'Mock',
        last_name: 'Provider',
        name: 'Mock Provider',
        email: email,
        practice: 'Mock Practice',
        practice_type: 'chiropractic',
        role: 'provider' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    
    try {
      console.log('Fetching provider by email:', email);
      
      const cacheKey = `provider:email:${email}`;
      const cached = apiCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Returning cached provider data');
        return cached.data;
      }
      
      const headers = await getHeaders();
      const url = `${XANO_API_BASE}/providers?email=${encodeURIComponent(email)}`;
      console.log('Request URL:', url);
      
      const response = await fetchWithTimeout(url, {
        method: 'GET',
        headers,
      }, 5000); // 5 second timeout for provider lookup
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch provider by email: ${response.status}`);
      }
      
      const providers = await response.json();
      console.log('Providers response:', providers);
      
      if (Array.isArray(providers) && providers.length > 0) {
        console.log('Found provider:', providers[0]);
        // Cache the provider
        apiCache.set(cacheKey, { data: providers[0], timestamp: Date.now() });
        return providers[0];
      }
      
      console.log('No provider found for email:', email);
      return null;
    } catch (error) {
      console.error('Error fetching provider by email:', error);
      throw error;
    }
  },

  // Get provider by Memberstack ID
  async getProviderByMemberstackId(memberstackId: string) {
    if (useMockData) {
      return {
        id: 1,  // Mock provider ID as number
        memberstack_id: memberstackId,
        first_name: 'Mock',
        last_name: 'Provider',
        name: 'Mock Provider',
        email: 'mock@provider.com',
        practice: 'Mock Practice',
        practice_type: 'chiropractic',
        role: 'provider' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/providers/memberstack/${memberstackId}`, {
        method: 'GET',
        headers,
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch provider');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching provider:', error);
      throw error;
    }
  },

  // Update provider
  async updateProvider(providerId: number, updates: Partial<Provider>) {
    if (useMockData) {
      return {
        id: providerId,
        ...updates,
        updated_at: new Date().toISOString(),
      };
    }
    
    try {
      const headers = await getHeaders();
      const response = await fetch(`${XANO_API_BASE}/providers/${providerId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update provider');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating provider:', error);
      throw error;
    }
  },
};
