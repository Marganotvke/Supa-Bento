import { defineConfig, defineRunnerConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'tabs'],
    "browser_specific_settings": {
    "gecko": {
      "id": "addon@example.com",
    }
  }
  },
});