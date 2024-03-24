export interface QrObject {
  id: string;
  createdAt: string;
  disabled: boolean;
  destinationUrl: string;
}

export interface QrObjectSvg extends QrObject {
  svg: string;
}
