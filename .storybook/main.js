import { resolve } from 'path';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',     // só TS/TSX
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },

  async viteFinal(originalConfig) {
    return mergeConfig(originalConfig, {
      // O framework @storybook/react-vite já configura o plugin do React.
      // A reconfiguração manual que existia aqui foi removida para evitar conflitos.

      // 2) Seu alias “@” para src continua
      resolve: {
        alias: {
          ...(originalConfig.resolve?.alias || {}),
          '@': resolve(__dirname, '../src'),
        },
      },

      // 3) Pré-bundle de React/React-DOM
      optimizeDeps: {
        ...(originalConfig.optimizeDeps || {}),
        include: ['react', 'react-dom'],
      },
    });
  },
};

export default config;
