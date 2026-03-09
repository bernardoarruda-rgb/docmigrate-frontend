import { createBrowserRouter, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { SpaceListPage } from '@/pages/SpaceListPage'
import { SpaceDetailPage } from '@/pages/SpaceDetailPage'
import { PageViewPage } from '@/pages/PageViewPage'
import { PageEditPage } from '@/pages/PageEditPage'

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/spaces" replace /> },
      { path: 'spaces', element: <SpaceListPage /> },
      { path: 'spaces/:spaceId', element: <SpaceDetailPage /> },
      { path: 'pages/:pageId', element: <PageViewPage /> },
      { path: 'pages/:pageId/edit', element: <PageEditPage /> },
    ],
  },
])
