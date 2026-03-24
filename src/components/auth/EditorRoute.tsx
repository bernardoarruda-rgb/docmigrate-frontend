import { Navigate } from 'react-router-dom'
import { usePermissions } from '@/hooks/usePermissions'

interface EditorRouteProps {
  children: React.ReactNode
}

export function EditorRoute({ children }: EditorRouteProps) {
  const { canEdit } = usePermissions()

  if (!canEdit) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
