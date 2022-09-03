import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/components/Login'
import {C01, C02, C03, redefinirSenha} from './src/components/Cadastro';
import Home from './src/components/Home';

const Stack = createNativeStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
            screenOptions={{
            headerShown: false
            }}
            >
                <Stack.Screen
                    name="Login"
                    component={Login}
                />
                <Stack.Screen 
                name="C01" 
                component={C01} 
                />
                <Stack.Screen 
                name="C02" 
                component={C02} 
                />
                <Stack.Screen 
                name="C03" 
                component={C03} 
                />
                <Stack.Screen 
                name="redefinirSenha" 
                component={redefinirSenha} 
                />
                <Stack.Screen 
                name="Home" 
                component={Home} 
                />
        </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Routes;