import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/contexts/auth';
import Login from './src/pages/Login/index';
import C04, { C00, C01, C02, C03, RedefinirSenha } from './src/pages/Cadastro/index';
import Home from './src/pages/Home/index';
import Perfil, {EditarSenha} from './src/pages/Perfil';
import UsuarioBarbearias from './src/pages/UsuarioBarbearias';
import DadosBarbearia from './src/pages/DadosBarbearia';
import MenuBarbearia from './src/pages/MenuBarbearia';
import globalStyles from './src/globalStyles';
import HorariosBarbearia from './src/pages/HorariosBarbearia';
import CategoriasServico from './src/pages/CategoriasServico';
import Servicos from './src/pages/Servicos';

const Stack = createNativeStackNavigator();

const Routes = () => {
    return (
        <AuthProvider>
        <NavigationContainer>
            <Stack.Navigator
            screenOptions={{
            headerShown: true,
            headerBackTitleVisible: false,
            headerTitle: '',
            headerStyle: { backgroundColor: globalStyles.main_color },
            headerTintColor: '#000',
            headerTransparent: true
            }}
            >
                <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
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
                options={{ headerShown: false, gestureEnabled: false }}
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
                name="DadosBarbearia"
                component={DadosBarbearia}
                />
                <Stack.Screen
                name="MenuBarbearia"
                component={MenuBarbearia}
                />
                <Stack.Screen
                name="HorariosBarbearia"
                component={HorariosBarbearia}
                />
                <Stack.Screen
                name="CategoriasServico"
                component={CategoriasServico}
                />
                <Stack.Screen
                name="Servicos"
                component={Servicos}
                />
            </Stack.Navigator>
        </NavigationContainer>
        </AuthProvider>
    )
}

export default Routes;