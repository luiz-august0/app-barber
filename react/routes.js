import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/contexts/auth';
import Login from './src/pages/Login/index';
import {C00, C01, C02, C03, C04, RedefinirSenha} from './src/pages/Cadastro/index';
import Home from './src/pages/Home/index';
import Perfil, {EditarSenha} from './src/pages/Perfil';
import UsuarioBarbearias from './src/pages/UsuarioBarbearias';
import EdicaoBarbearia from './src/pages/EdicaoBarbearia';

const Stack = createNativeStackNavigator();

const Routes = () => {
    return (
        <AuthProvider>
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
                name="C00"
                component={C00}
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
                name="C04" 
                component={C04} 
                />
                <Stack.Screen 
                name="RedefinirSenha" 
                component={RedefinirSenha} 
                />
                <Stack.Screen 
                name="Home" 
                component={Home} 
                />
                <Stack.Screen
                name="Perfil"
                component={Perfil}
                />
                <Stack.Screen
                name="EditarSenha"
                component={EditarSenha}
                />
                <Stack.Screen
                name="UsuarioBarbearias"
                component={UsuarioBarbearias}
                />
                <Stack.Screen
                name="EdicaoBarbearia"
                component={EdicaoBarbearia}
                />
            </Stack.Navigator>
        </NavigationContainer>
        </AuthProvider>
    )
}

export default Routes;