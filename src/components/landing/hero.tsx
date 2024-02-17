import { LightningBolt } from "../icons/lightning-bolt";
import { Qr } from "../icons/qr";
import { Button } from "../shared/button";
import { Input } from "../shared/input";
import { QrImage } from "../shared/qr-image";

export const Hero = () => {
  return (
    <section className="flex items-center justify-between gap-20 w-full h-96">
      <div className="flex-1 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Generate a QR</h1>
        <Input
          label="Destination URL"
        />
        <div className="flex gap-2">
          <Button>
            <span className="flex gap-2">
              Generate <Qr width={20} color="#fff" />
            </span>
          </Button>

          <Button disabled title="You need to login">
            <span className="flex gap-2">
              PermaQR <LightningBolt width={20} color="#fff" />
            </span>
          </Button>
        </div>
      </div>
      <div>
        <QrImage svg="" size="large" />
      </div>
    </section>
  );
}