export interface JpgridCenter {
  lat: number;
  lon: number;
}

export interface JpgridBbox {
  west: number;
  south: number;
  north: number;
  east: number;
}

export function jpgrid_encode(lat: number, lon: number): string;
export function jpgrid_encodeLv1(lat: number, lon: number): string;
export function jpgrid_encodeLv2(lat: number, lon: number): string;
export function jpgrid_encodeLv3(lat: number, lon: number): string;
export function jpgrid_encodeHalf(lat: number, lon: number): string;
export function jpgrid_encodeQuarter(lat: number, lon: number): string;
export function jpgrid_encodeEighth(lat: number, lon: number): string;
export function jpgrid_encodeUni10(lat: number, lon: number): string;
export function jpgrid_encodeUni5(lat: number, lon: number): string;
export function jpgrid_encodeUni2(lat: number, lon: number): string;
export function jpgrid_decode(geocode: string): JpgridCenter;
export function jpgrid_bbox(geocode: string): JpgridBbox;
