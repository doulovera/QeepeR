import { useState } from "react";
import { Save } from "@/components/icons/save";
import { Input } from "@/components/shared/input";

export const DestinationUrlField = (
  { id, destinationUrl }:
  {
    id: string;
    destinationUrl: string;
  }
) => {
  const [destinationUrlValue, setDestinationUrlValue] = useState(destinationUrl)
  const [dbDestinationUrl, setDbDestinationUrl] = useState(destinationUrl)

  const hasChanges = destinationUrlValue !== dbDestinationUrl

  const handleSave = async () => {
    const response = false

    if (response) {
      console.log('TODO: add toast notification for success')

      setDbDestinationUrl(destinationUrlValue)
    }
  }

  return (
    <Input
      label="Edit Destination URL"
      description="The link you want it to redirect"
      value={destinationUrlValue}
      onChange={(event) => setDestinationUrlValue(event.target.value)}
      iconBtn={<Save width="20" color="#fff" />}
      showIconBtn={hasChanges}
      iconBtnOnClick={handleSave}
    />
  )
}