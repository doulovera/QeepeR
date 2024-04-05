import { useState } from "react";
import { Save } from "@/components/icons/save";
import { Input } from "@/components/shared/input";
import { updateQr } from "@/modules/qr-generation/update-qr";

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
    const response = await updateQr({
      id,
      newUrl: destinationUrlValue,
    })

    if (response) {
      console.log('TODO: add toast notification for success')

      setDbDestinationUrl(destinationUrlValue)
    }
  }

  return (
    <Input
      label="Destination URL"
      description="The link you want it to redirect"
      value={destinationUrlValue}
      onChange={(event) => setDestinationUrlValue(event.target.value)}
      iconBtn={hasChanges && <Save width="20" color="#fff" />}
      iconBtnOnClick={handleSave}
    />
  )
}