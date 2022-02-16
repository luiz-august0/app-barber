import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/components/Login'
import {C01, C02, C03, redefinirSenha} from './src/components/Cadastro';
import Home from './src/components/Home';
import Perfil from './src/components/Perfil';
import Config from './src/components/Config';
import { Agenda, AgendaBarbeiro, AgendaHorario, AgendaServico, MeusAgendamentos } from './src/components/Agendamento';




const Stack = createNativeStackNavigator();





export default function App() {
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
         <Stack.Screen 
        name="Perfil" 
        component={Perfil} 
        />
         <Stack.Screen 
        name="Config" 
        component={Config} 
        />
         <Stack.Screen 
        name="Agenda" 
        component={Agenda} 
        />
        <Stack.Screen 
        name="AgendaBarbeiro" 
        component={AgendaBarbeiro} 
        />
        <Stack.Screen 
        name="AgendaServico" 
        component={AgendaServico} 
        />
        <Stack.Screen 
        name="AgendaHorario" 
        component={AgendaHorario} 
        />
        <Stack.Screen 
        name="MeusAgendamentos" 
        component={MeusAgendamentos} 
        />
      </Stack.Navigator>
    </NavigationContainer>
    );
  }