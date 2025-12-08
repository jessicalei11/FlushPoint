import 'dotenv/config'; 

const GOOGLE_MAPS_APIKEY = process.env.GOOGLE_MAPS_APIKEY;

export default ({ config }) => ({
  ...config,
  
  "name": "mobile",
  "slug": "mobile",
  "version": "1.0.0",
  "orientation": "portrait",
  "icon": "./assets/images/FlushPoint_Logo.png",
  "scheme": "mobile",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true,

  "ios": {
    "supportsTablet": true,
    "config": {
      "googleMapsApiKey": GOOGLE_MAPS_APIKEY 
    }
  },

  "android": {
    "config": {
      "googleMaps": {
        "apiKey": GOOGLE_MAPS_APIKEY 
      }
    }
  },

  "extra": {
    "googleMapsApiKey": GOOGLE_MAPS_APIKEY, 
    "eas": {
      "projectId": "your-eas-project-id" 
    }
  },

  "web": {
    "output": "static",
    "favicon": "./assets/images/favicon.png"
  },
  "plugins": [
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash-icon.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#ffffff",
        "dark": {
          "backgroundColor": "#000000"
        }
      }
    ]
  ],
  "experiments": {
    "typedRoutes": true,
    "reactCompiler": true
  }
});