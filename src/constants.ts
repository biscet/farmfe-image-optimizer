export const PLUGIN_NAME = 'farmfe-image-optimizer';

export const DEFAULT_OPTIONS = {
  logStats: true,
  ansiColors: true,
  includePublic: true,
  exclude: undefined,
  include: undefined,
  test: /\.(jpe?g|png)$/i,
  png: {
    quality: 95,
    compressionLevel: 5,
  },
  jpeg: {
    quality: 20,
  },
  jpg: {
    quality: 20,
  },
  cache: false,
  cacheLocation: undefined,
};
