import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'tabs'],
    "browser_specific_settings": {
    "gecko": {
      "id": "{8b2c0c71-276f-47e6-b5f5-063e0617fee0}",
    }
  }
  },
});