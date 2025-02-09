import type { FetchStatus } from "@/types/types";
import { useState } from "react";

import { Input } from "../../shared/input"
import { Switch } from "../../shared/switch"
import { DestinationUrlField } from "./destination-url-field";
import { Button } from "@/components/shared/button";

export const EditForm = (
  { id, destinationUrl, disabled }:
  {
    id: string;
    destinationUrl: string;
    disabled: boolean;
  }
) => {
  const fieldNames = {
    disabled: 'disabled',
    disableViews: 'disableViews',
  }

  const [status, setStatus] = useState<Record<string, FetchStatus>>({})

  const handleUpdateSwitch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus({ ...status, [event.target.name]: 'FETCHING' })
    const response = true

    if (response) {
      setStatus({ ...status, [event.target.name]: 'SUCCESS' })
    }
  }

  return (
    <section className="flex flex-col gap-6 mb-2">
       <div className="hidden justify-between gap-20">
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

      <div className="flex justify-start gap-4 mt-8">
        <Button
          className="flex justify-center text-center w-1/4"
          color="danger"
        >
          Delete
        </Button>
      </div>
    </section>
  )
}