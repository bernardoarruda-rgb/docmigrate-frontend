import { ENDPOINTS } from '@/config/endpoints'
import { apiClient } from '@/lib/apiClient'
import type { FileUploadResponse } from '@/types/file'

export const fileService = {
  uploadIcon: (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.upload<FileUploadResponse>(ENDPOINTS.FILES_ICONS, formData)
  },

  uploadImage: (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.upload<FileUploadResponse>(ENDPOINTS.FILES_IMAGES, formData)
  },

  uploadVideo: (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.upload<FileUploadResponse>(ENDPOINTS.FILES_VIDEOS, formData)
  },
}
