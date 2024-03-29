module.exports = {
    name: "app-barber",
    slug: "app-barber",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: {
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
        "**/*"
    ],
    ios: {
        supportsTablet: true
    },
    android: {
        adaptiveIcon: {
            backgroundColor: "#FFFFFF"
        },
        package: "com.barberapp.barberapp",
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        versionCode: 1,
        permissions: [
            "android.permission.RECORD_AUDIO"
        ],
        config: {
            googleMaps: {
                apiKey: process.env.EXPO_PUBLIC_MAPS_KEY
            }
        }
    },
    web: {},
    plugins: [
        [
            "expo-image-picker",
            {
                photosPermission: "The app accesses your photos to let you share them with your friends."
            }
        ],
        "sentry-expo"
    ],
    hooks: {
        postPublish: [
            {
                file: "sentry-expo/upload-sourcemaps",
                config: {
                    organization: "app-barber",
                    project: "app-barber",
                    authToken: process.env.EXPO_PUBLIC_SENTRY_TOKEN
                }
            }
        ]
    },
    extra: {
        eas: {
            projectId: "57f9b4e7-1dc5-481c-92d4-9730ea3d3fd5"
        }
    }
}  