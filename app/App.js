import React from 'react';
import {registerRootComponent} from 'expo';
import * as Font from 'expo-font';
import Routes from './routes';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from "react-native-safe-area-context";
import storeConfig from './src/store/storeConfig';
import * as Sentry from 'sentry-expo';

Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    enableInExpoDevelopment: true,
    debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
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

export default class Redux extends React.Component {

    state = {
        fontsLoaded: false,
    };

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true });
    }

    componentDidMount() {
        this._loadFontsAsync();
    }

    render() {
        if (!this.state.fontsLoaded) {
        return null;
        }

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