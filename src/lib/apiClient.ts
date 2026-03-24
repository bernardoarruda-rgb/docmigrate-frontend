import type { ApiError } from '@/types/api'
import { getToken, ensureFreshToken } from '@/lib/authStore'

export class ApiClientError extends Error {
  status: number
  data: ApiError

  constructor(status: number, data: ApiError) {
    super(data.message)
    this.name = 'ApiClientError'
    this.status = status
    this.data = data
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    return undefined as T
  }

  if (!response.ok) {
    const data: ApiError = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new ApiClientError(response.status, data)
  }
  if (response.status === 204) return undefined as T
  return response.json()
}

// Refresh token before each request (like OKR pattern)
const getHeaders = async (headers: Record<string, string> = {}) => {
  // Try to refresh if standalone Keycloak mode
  await ensureFreshToken()

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const apiClient = {
  get: async <T>(url: string): Promise<T> =>
    fetch(url, { headers: await getHeaders() }).then((res) => handleResponse<T>(res)),

  post: async <T>(url: string, body: unknown): Promise<T> =>
    fetch(url, {
      method: 'POST',
      headers: await getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    }).then((res) => handleResponse<T>(res)),

  put: async <T>(url: string, body: unknown): Promise<T> =>
    fetch(url, {
      method: 'PUT',
      headers: await getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    }).then((res) => handleResponse<T>(res)),

  patch: async <T>(url: string, body: unknown): Promise<T> =>
    fetch(url, {
      method: 'PATCH',
      headers: await getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    }).then((res) => handleResponse<T>(res)),

  delete: async (url: string): Promise<void> =>
    fetch(url, { method: 'DELETE', headers: await getHeaders() }).then((res) =>
      handleResponse<void>(res),
    ),

  upload: async <T>(url: string, formData: FormData): Promise<T> =>
    fetch(url, {
       method: 'POST',
       headers: await getHeaders(),
       body: formData
    }).then((res) => handleResponse<T>(res)),
}
