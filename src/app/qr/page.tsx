'use server'

import { redirect } from 'next/navigation'
import { getUserMe } from '@/data/services/get-user-me-service'
import { listPermaQRs } from '@/data/actions/perma-code-actions'

export default async function Page() {
  const user = await getUserMe()
  
  if (!user) {
    return redirect('/')
  }

  const list = await listPermaQRs()

  const transformTimestamp = (timestamp: any) => {
    return timestamp.toDate().toString()
  }

  return (
    <div>
      <h1>QR List</h1>
      
      <ul>
        {list && list.map((item) => (
          <li key={item.destinationUrl} className="border-2 border-white">
            {
              Object.entries(item).map(([key, value]) => (
                <div key={key}>
                  <strong>{key}</strong>: {key === 'createdAt' ? transformTimestamp(value) : value}
                </div>
              ))
            }
          </li>
        ))}
      </ul>
    </div>
  )
}
