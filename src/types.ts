import type { PngOptions, JpegOptions, TiffOptions, GifOptions, WebpOptions, AvifOptions } from 'sharp';

export interface Options {
  test?: RegExp;
  include?: RegExp | string | string[];
  exclude?: RegExp | string | string[];
  includePublic?: boolean;
  ansiColors?: boolean;
  logStats?: boolean;
  png?: PngOptions;
  jpeg?: JpegOptions;
  jpg?: JpegOptions;
  tiff?: TiffOptions;
  gif?: GifOptions;
  webp?: WebpOptions;
  avif?: AvifOptions;
  cache?: boolean;
  cacheLocation?: string;
}

export interface Sizes {
  size: number;
  oldSize: number;
  ratio: number;
  skipWrite: boolean;
  isCached: boolean;
}
