import type { FetchStatus } from '@/types/types'
import { useState } from 'react'

import { Input } from '../../shared/input'
import { Switch } from '../../shared/switch'
import { DestinationUrlField } from './destination-url-field'
import { Button } from '@/components/shared/button'
import {
  deleteDynamicQR,
  disableDynamicQR,
  enableDynamicQR,
} from '@/data/actions/dynamic-code-actions'

export const EditForm = ({
  id,
  destinationUrl,
  disabled,
}: {
  id: string
  destinationUrl: string
  disabled: boolean
}) => {
  const fieldNames = {
    disabled: 'disabled',
    disableViews: 'disableViews',
  }

  const [status, setStatus] = useState<Record<string, FetchStatus>>({})

  const handleUpdateSwitch = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.checked
    const name = event.target.name

    // use a modal here
    const userResponse = confirm(
      `Are you sure you want to ${value ? 'disable' : 'enable'} this QR?`,
    )
    if (!userResponse) return

    setStatus({ ...status, [name]: 'FETCHING' })
    let response = false

    // disable QR
    if (value) {
      response = await disableDynamicQR(id)
    }

    // enable QR
    if (!value) {
      response = await enableDynamicQR(id)
    }

    setStatus({
      ...status,
      [name]: response ? 'SUCCESS' : 'FAILED',
    })
  }

  const handleDelete = async () => {
    // use a modal here
    const userResponse = confirm('Are you sure you want to delete this QR?')
    if (!userResponse) return

    setStatus({ ...status, delete: 'FETCHING' })
    const response = await deleteDynamicQR(id)

    if (response) {
      setStatus({ ...status, delete: 'SUCCESS' })
    } else {
      setStatus({ ...status, delete: 'FAILED' })
    }

    return response
  }

  return (
    <section className="flex flex-col gap-6 mb-2">
      <div className="hidden justify-between gap-20">
        <Input label="Background Color" disabled />
        <Input label="Squares Color" disabled />
      </div>

      <div className="w-full">
        <DestinationUrlField id={id} destinationUrl={destinationUrl} />
      </div>

      <div className="justify-between items-center gap-20">
        <Switch
          name={fieldNames.disabled}
          label="Disable Link"
          description="If this option is enabled, the QR will show a 404 page"
          checked={disabled}
          disabled={status.disabled === 'FETCHING'}
          onChange={handleUpdateSwitch}
        />
        <div className="hidden">
          <Switch
            name={fieldNames.disableViews}
            label="Visitors Count"
            description="Keep track of the amount of people that visits your QR"
            disabled
          />
        </div>
      </div>

      <div className="flex justify-start gap-4 mt-8">
        <Button
          className="flex justify-center text-center w-1/4"
          color="danger"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </div>
    </section>
  )
}
