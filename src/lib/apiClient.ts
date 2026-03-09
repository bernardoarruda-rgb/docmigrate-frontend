import type { ApiError } from '@/types/api'

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
  if (!response.ok) {
    const data: ApiError = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new ApiClientError(response.status, data)
  }
  if (response.status === 204) return undefined as T
  return response.json()
}

export const apiClient = {
  get: <T>(url: string): Promise<T> =>
    fetch(url).then((res) => handleResponse<T>(res)),

  post: <T>(url: string, body: unknown): Promise<T> =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => handleResponse<T>(res)),

  put: <T>(url: string, body: unknown): Promise<T> =>
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => handleResponse<T>(res)),

  delete: (url: string): Promise<void> =>
    fetch(url, { method: 'DELETE' }).then((res) => handleResponse<void>(res)),
}
