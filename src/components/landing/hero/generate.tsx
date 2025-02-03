'use client'

import { useState } from "react";

import { QrImage } from "@/components/shared/qr-image";

import { QrGenerationForm } from "./qr-form";
import { Card } from "@/components/shared/card";
import { DownloadButton } from "./download-button";

interface Props {
  isUserLogged: boolean
}

export function Generate({ isUserLogged }: Props) {
  const [svg, setSvg] = useState<string | null>(null)

  return (
    <Card as="section" shadow={false}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_30%] items-center gap-12 w-full min-h-80">
        <QrGenerationForm
          setSvg={setSvg}
          isUserLogged={isUserLogged}
        />
        <div className="flex flex-col justify-center gap-2">
          <QrImage svg={svg || ''} />
          
          <DownloadButton svg={svg} />
        </div>
      </div>
    </Card>
  );
}