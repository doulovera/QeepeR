'use client'

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { QrItem } from "@/components/qr-list/qr-item";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

/// TODO: put in correct file
type QrInfoResponse = {
  svg: string;
  id: string;
  createdAt: string | undefined;
  disabled: boolean;
  destinationUrl: string;
}
type Response = {
  success: boolean
  image: boolean
  result: QrInfoResponse[]
}

export const List = () => {
  const user = useAuth();
  const [list, setList] = useState<QrInfoResponse[]>([])

  useEffect(() => {
    async function fetchList() {
      const res = await fetch(`${API_BASE_URL}/gen/list?img=true`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.accessToken}`
        },
      })

      const data: Response = await res.json()
      setList(data.result)
    }

    if (user?.accessToken) fetchList()
  }, [user?.accessToken])


  return (
    <>
      {
        list.slice(0,1).map(({ svg, id, disabled, destinationUrl }) => (
          <QrItem
            key={id}
            svg={svg}
            id={id}
            disabled={disabled}
            destinationUrl={destinationUrl}
          />
        ))
      }
    </>
  )
}