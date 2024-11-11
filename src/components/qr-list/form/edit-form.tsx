import type { FetchStatus } from "@/types/types";
import { useState } from "react";

import { Input } from "../../shared/input"
import { Switch } from "../../shared/switch"
import { DestinationUrlField } from "./destination-url-field";

export const EditForm = (
  { id, destinationUrl, disabled }:
  {
    id: string;
    destinationUrl: string;
    disabled: boolean;
    // handle colors change
  }
) => {
  const fieldNames = {
    disabled: 'disabled',
    disableViews: 'disableViews',
  }

  const [status, setStatus] = useState<Record<string, FetchStatus>>({})

  const handleUpdateSwitch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus({ ...status, [event.target.name]: 'FETCHING' })
    const response = false

    if (response) {
      setStatus({ ...status, [event.target.name]: 'SUCCESS' })
    }
  }

  return (
    <>
       <div className="flex justify-between gap-20">
        <Input
          label="Background Color"
          disabled
        />
        <Input
          label="Squares Color"
          disabled
        />
      </div>
      
      <div className="w-full">
        <DestinationUrlField
          id={id}
          destinationUrl={destinationUrl}
        />
      </div>

      <div className="flex justify-between items-center gap-20">
        <Switch
          name={fieldNames.disabled}
          label="Disable Link"
          description="If this option is enabled, the QR will show a 404 page"
          checked={disabled}
          disabled={status.disabled === 'FETCHING'}
          onChange={handleUpdateSwitch}
        />
        <Switch
          name={fieldNames.disableViews}
          label="Visitors Count"
          description="Keep track of the amount of people that visits your QR"
          disabled
        />
      </div>
    </>
  )
}