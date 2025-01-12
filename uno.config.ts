// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss';

export default defineConfig({
  theme: {
    colors: {
      // ...
      myDarkBgColor: '#141414',
      myMainDarkBgColor: '#1c1c1c'
    }
  },
  presets: [
    presetAttributify({
      /* preset options */
    }),
    presetUno()
  ],
  shortcuts: {
    'ct-border': 'border-t-1px border-t-solid border-t-gray-300',
    'cr-border': 'border-r-1px border-r-solid border-r-gray-300 ',
    'cl-border': 'border-l-1px border-l-solid border-l-gray-300',
    'cb-border': 'border-b-1px border-b-solid border-b-gray-300'
  }
});
