'use client'

import type { ClientIQRS } from '@/data/models/IQRs'
import { Item } from './item'

type Props = {
  list: ClientIQRS[] | null
}

export function List({ list }: Props) {
  return (
    <section className="flex flex-col gap-4 mt-10">
      {list?.map((item) => (
        <Item key={item.alias} {...item} />
      ))}
    </section>
  )
}
