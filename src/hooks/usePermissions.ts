import { useAuth } from '@/contexts/AuthContext'

const EDITOR_ROLE = 'docmigrate-editor'

export function usePermissions() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return { canEdit: false }
  }

  // Check for docmigrate-editor role in Keycloak resource_access or realm_access
  const resourceRoles = user.resource_access?.['docmigrate-api']?.roles
  const frontendRoles = user.resource_access?.['docmigrate-frontend']?.roles
  const realmRoles = user.realm_access?.roles

  const hasEditorRole =
    resourceRoles?.includes(EDITOR_ROLE) ||
    frontendRoles?.includes(EDITOR_ROLE) ||
    realmRoles?.includes(EDITOR_ROLE) ||
    false

  return {
    canEdit: hasEditorRole,
  }
}
