import { useMutation } from '@tanstack/react-query'
import { fileService } from '@/services/fileService'

export function useUploadIcon() {
  return useMutation({
    mutationFn: (file: File) => fileService.uploadIcon(file),
  })
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => fileService.uploadImage(file),
  })
}

export function useUploadVideo() {
  return useMutation({
    mutationFn: (file: File) => fileService.uploadVideo(file),
  })
}
