import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nexuscontrol.app',
  appName: 'Nexus Control',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,
    // For local development
    url: 'http://localhost:3000',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: process.env.ANDROID_KEYSTORE_PATH || '',
      keystoreAlias: process.env.ANDROID_KEYSTORE_ALIAS || '',
      keystoreAliasPassword: process.env.ANDROID_KEYSTORE_ALIAS_PASSWORD || '',
      keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD || '',
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0f172a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0f172a'
    },
    App: {
      launchUrl: 'https://localhost'
    },
    Keyboard: {
      resize: 'body'
    }
  }
};

export default config;
