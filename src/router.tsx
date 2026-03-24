import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { MainLayout } from '@/layouts/MainLayout'
import { EditorRoute } from '@/components/auth/EditorRoute'
import { Skeleton } from '@/components/ui/skeleton'

const SpaceHubPage = lazy(() => import('@/pages/SpaceHubPage').then(m => ({ default: m.SpaceHubPage })))
const SpaceDetailPage = lazy(() => import('@/pages/SpaceDetailPage').then(m => ({ default: m.SpaceDetailPage })))
const PageViewPage = lazy(() => import('@/pages/PageViewPage').then(m => ({ default: m.PageViewPage })))
const PageEditPage = lazy(() => import('@/pages/PageEditPage').then(m => ({ default: m.PageEditPage })))
const TemplateListPage = lazy(() => import('@/pages/TemplateListPage').then(m => ({ default: m.TemplateListPage })))
const TagListPage = lazy(() => import('@/pages/TagListPage').then(m => ({ default: m.TagListPage })))
const TranslationEditorPage = lazy(() => import('@/pages/TranslationEditorPage').then(m => ({ default: m.TranslationEditorPage })))

function PageFallback() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    element: (
      <SidebarProvider>
        <MainLayout />
      </SidebarProvider>
    ),
    children: [
      { index: true, element: <Suspense fallback={<PageFallback />}><SpaceHubPage /></Suspense> },
      { path: 'spaces/:spaceId', element: <Suspense fallback={<PageFallback />}><SpaceDetailPage /></Suspense> },
      { path: 'spaces/:spaceId/pages/:pageId', element: <Suspense fallback={<PageFallback />}><PageViewPage /></Suspense> },
      { path: 'spaces/:spaceId/pages/:pageId/edit', element: <EditorRoute><Suspense fallback={<PageFallback />}><PageEditPage /></Suspense></EditorRoute> },
      { path: 'spaces/:spaceId/pages/:pageId/translate/:lang', element: <EditorRoute><Suspense fallback={<PageFallback />}><TranslationEditorPage /></Suspense></EditorRoute> },
      { path: 'templates', element: <EditorRoute><Suspense fallback={<PageFallback />}><TemplateListPage /></Suspense></EditorRoute> },
      { path: 'tags', element: <EditorRoute><Suspense fallback={<PageFallback />}><TagListPage /></Suspense></EditorRoute> },
    ],
  },
])
