import { Hono } from 'hono'
import qr from 'qrcode'

import { set } from './db'

const app = new Hono()

app.post('/', async (c) => {
  const url = 'https://doulovera.com'

  const qrImage = await qr.toString(url, {
    type: 'svg',
    // color: {
    //   light: '#3685FF',
    //   dark: '#ffffff'
    // }
  })

  await set('doulovera', 'site', url)

  return c.json({ svg: qrImage })
})

export default app
