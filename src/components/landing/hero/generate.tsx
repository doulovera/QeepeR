'use client'

import { useState } from "react";

import { QrImage } from "@/components/shared/qr-image";
import { Button } from "@/components/shared/button";

import { QrGenerationForm } from "./qr-form";
import { downloadSvg } from "@/utils/download-svg";
import { Card } from "@/components/shared/card";

interface Props {
  isUserLogged: boolean
}

export function Generate({ isUserLogged }: Props) {
  const [svg, setSvg] = useState<string | null>(null)

  const handleSave = () => {
    if (!svg) return
    downloadSvg('qr-code', svg)
  }

  return (
    <Card as="section" shadow={false}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-20 w-full min-h-80">
        <QrGenerationForm
          setSvg={setSvg}
          isUserLogged={isUserLogged}
        />
        <div className="flex flex-col justify-center gap-2">
          <QrImage svg={svg || ''} size="large" />
          <Button
            onClick={handleSave}
            disabled={!svg}
          >
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
}