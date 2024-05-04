'use client'

import { Suspense, lazy } from "react";
import { useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";

/// @ts-ignore
const QrItem = lazy(() => import('@/components/qr-list/qr-item'))


export const List = ({ id }: { id: string }) => {
  const user = useAuth();
  
  if (!user || !user.accessToken) return null

  return (
    <Suspense fallback={<p>Loading in the Suspense...</p>}>
      <QrItem
        user={user}
        id={id}
      />
    </Suspense>
  )
}