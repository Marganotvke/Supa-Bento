import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['storage', 'tabs'],
    "browser_specific_settings": {
    "gecko": {
      "id": "58261562+Marganotvke@users.noreply.github.com.",
    }
  }
  },
});