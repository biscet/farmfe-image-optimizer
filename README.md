# farmfe-image-optimizer

"@farmfe/core": "1.2.6"

## Установка

Вы можете добавить его как зависимость из удобного вам менеджера пакетов. (NPM, Yarn, PNPM)

Поддерживает `Farmfe >=1.2.6`, `Node >=14`, `Sharp >=0.32.1`

```console
  yarn add farmfe-image-optimizer sharp
```

## Использование

```js
import { FarmfeImageOptimizer } from 'farmfe-image-optimizer';
import { defineConfig } from '@farmfe/core';

export default defineConfig(() => {
  return {
    vitePlugins: [
      FarmfeImageOptimizer({
        /* pass your config */
      }),
    ],
  };
});
```

## Конфигурация по умолчанию

```js
const DEFAULT_OPTIONS = {
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
};
```

Данный плагин был сделан на основе [Vite Image Optimizer](https://github.com/FatehAK/vite-plugin-image-optimizer)

[MIT](./LICENSE)
