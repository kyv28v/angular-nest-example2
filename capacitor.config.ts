import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'angular-nest-example2',
  webDir: 'dist/apps/web',
  server: {
    androidScheme: 'https'
  }
};

export default config;
