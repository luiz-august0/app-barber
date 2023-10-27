import React from 'react';
import {registerRootComponent} from 'expo';
import * as Font from 'expo-font';
import Routes from './routes';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from "react-native-safe-area-context";
import storeConfig from './src/store/storeConfig';
import * as Sentry from 'sentry-expo';
import * as Notifications from 'expo-notifications';
import { extra } from './app.config';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enableInExpoDevelopment: true,
    debug: true,
});

let customFonts = {
    'Manrope-Bold': require('./src/assets/fonts/Manrope-Bold.ttf'),
    'Manrope-ExtraBold': require('./src/assets/fonts/Manrope-ExtraBold.ttf'),
    'Manrope-ExtraLight': require('./src/assets/fonts/Manrope-ExtraLight.ttf'),
    'Manrope-Light': require('./src/assets/fonts/Manrope-Light.ttf'),
    'Manrope-Medium': require('./src/assets/fonts/Manrope-Medium.ttf'),
    'Manrope-Regular': require('./src/assets/fonts/Manrope-Regular.ttf'),
    'Manrope-SemiBold': require('./src/assets/fonts/Manrope-SemiBold.ttf'),
};

const store = storeConfig();

async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
  
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') return;

    token = (await Notifications.getExpoPushTokenAsync({ projectId: extra.eas.projectId })).data;
  
    return token;
}

export default class Redux extends React.Component {
    constructor(props) {
        super(props);
        this.notificationListener = React.createRef();
        this.responseListener = React.createRef();
    }

    state = {
        fontsLoaded: false,
        expoPushToken: '',
        notification: false,
    };

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ ...this.state, fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
        registerForPushNotificationsAsync().then(token => this.setState({ ...this.state, expoPushToken: token }));

        this.notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            this.setState({ ...this.state, notification: notification });
        });
    
        /*this.responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });*/
    
        return () => {
            Notifications.removeNotificationSubscription(this.notificationListener.current);
            Notifications.removeNotificationSubscription(this.responseListener.current);
        };
    }

    render() {
        if (!this.state.fontsLoaded) return null;

        return (
            <Provider store={store}>
                <SafeAreaProvider>
                    <Routes/>
                </SafeAreaProvider>
            </Provider>

        );
    }
}

registerRootComponent(Redux);