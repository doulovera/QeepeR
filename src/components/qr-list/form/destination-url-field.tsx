import { useState } from "react";
import { Save } from "@/components/icons/save";
import { Input } from '@/components/ui/input'
import { updateUrlDynamicQR } from "@/data/actions/dynamic-code-actions";

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
    const response = await updateUrlDynamicQR(id, destinationUrlValue)

    if (response) {
      // TODO: add toast notification for success
      alert('Success. \nQR can take a few seconds to update.')

      setDbDestinationUrl(destinationUrlValue)
    } else {
      // TODO: add toast notification for error
      alert('Error')
    }
  }

  return (
    <Input
      placeholder="Edit Destination URL"
      value={destinationUrlValue}
      onChange={(event) => setDestinationUrlValue(event.target.value)}
    />
  )
}