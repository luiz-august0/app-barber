import React, { useState } from 'react';
import * as Font from 'expo-font';
import Routes from './routes';

let customFonts = {
    'Montserrat-Bold': require('./src/assets/fonts/Montserrat-Bold.ttf')
};

export default class App extends React.Component {

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
            <>
                <Routes/>
            </>
        );
    }
}