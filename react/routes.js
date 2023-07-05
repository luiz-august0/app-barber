import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerItem, DrawerItemList, DrawerContentScrollView } from '@react-navigation/drawer';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { AuthProvider } from './src/contexts/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "./src/services/api";
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
import DadosServico from './src/pages/DadosServico';
import Barbeiros from './src/pages/Barbeiros';
import DadosBarbeiro from './src/pages/DadosBarbeiro';
import MenuBarbeiro from './src/pages/MenuBarbeiro';
import Header from './src/components/Header';
import ServicosBarbeiro from './src/pages/ServicosBarbeiro';
import AgendamentoBarbearia from './src/pages/AgendamentoBarbearia';
import AgendamentoServico from './src/pages/AgendamentoServico';
import AgendamentoBarbeiro from './src/pages/AgendamentoBarbeiro';
import AgendamentoHorario from './src/pages/AgendamentoHorario';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerContent = (props) => {
    const logout = async() => {
        await AsyncStorage.removeItem("usuario");
        await AsyncStorage.removeItem("token");
        
        api.defaults.headers.Authorization = null;
    }

    return (
        <DrawerContentScrollView {...props}>
            <Header/>
            <DrawerItemList {...props} />
            <DrawerItem label="Sair" 
            labelStyle={{fontFamily: 'Manrope-Regular'}}
            icon={({color, size}) => <MIcon color={color} size={size + 20} name="logout" />}
            inactiveTintColor='#FFCA9F'
            onPress={() => { logout(); props.navigation.navigate('Login');}}/>
        </DrawerContentScrollView>
    )
}

const HomeNav = () => {
    return (
        <Drawer.Navigator useLegacyImplementation={true} initialRouteName="Home" 
            drawerContent={props => <DrawerContent {...props} />}
            screenOptions={{
                headerTitleStyle: { fontFamily: 'Manrope-Regular' },
                drawerLabelStyle: { fontFamily: 'Manrope-Regular' },
                headerShown: true,
                headerTintColor: "#2B513B",
                drawerInactiveTintColor: "#FFCA9F",
                headerPressColor: "#BA6213",
                drawerActiveTintColor: "#BA6213",
                drawerStyle: {
                    backgroundColor: '#2B513B',
                    width: 240,
                },
                headerStyle: {
                    backgroundColor: globalStyles.main_color,
                    shadowColor: 'transparent'
                }
            }}>
            <Drawer.Screen name="Home" component={Home} 
                options={
                    {
                        drawerIcon: ({color, size}) => (
                            size += 20,
                            <FIcon name="home" size={size} color={color}/>
                        ),
                        headerTitle: "Home"
                    }
                }/>
            <Drawer.Screen name="Perfil" component={Perfil}
                options={
                    {
                        drawerIcon: ({color, size}) => (
                            size += 20,
                            <MIcon name="person" size={size} color={color}/>
                        ),
                        headerTitle: "Perfil"
                    }
                }/>
        </Drawer.Navigator>
    )
}

const Routes = () => {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator
                screenOptions={{
                    headerShown: true,
                    headerBackTitleVisible: false,
                    headerStyle: { backgroundColor: globalStyles.main_color },
                    headerTintColor: '#2B513B',
                    headerTransparent: true,
                    headerTitleStyle: {fontFamily: 'Manrope-Regular'}
                }}
                initialRouteName='Login'>
                    <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                    />
                    <Stack.Screen
                    name="C00"
                    component={C00}
                    options={{ headerTitle: "" }}
                    />
                    <Stack.Screen 
                    name="C01" 
                    component={C01} 
                    options={{ headerTitle: "" }}
                    />
                    <Stack.Screen 
                    name="C02" 
                    component={C02} 
                    options={{ headerTitle: "" }}
                    />
                    <Stack.Screen 
                    name="C03" 
                    component={C03} 
                    options={{ headerTitle: "" }}
                    />
                    <Stack.Screen 
                    name="C04" 
                    component={C04} 
                    options={{ headerTitle: "" }}
                    />
                    <Stack.Screen 
                    name="RedefinirSenha" 
                    component={RedefinirSenha} 
                    options={{ headerTitle: "Recuperação de Senha" }}
                    />
                    <Stack.Screen 
                    name="HomeNav" 
                    component={HomeNav} 
                    options={{ headerShown: false, gestureEnabled: false }}
                    />
                    <Stack.Screen
                    name="EditarSenha"
                    component={EditarSenha}
                    options={{ headerTitle: "Alterar Senha" }}
                    />
                    <Stack.Screen
                    name="UsuarioBarbearias"
                    component={UsuarioBarbearias}
                    options={{ headerTitle: "Barbearias" }}
                    />
                    <Stack.Screen
                    name="DadosBarbearia"
                    component={DadosBarbearia}
                    options={{ headerTitle: "Dados da Barbearia" }}
                    />
                    <Stack.Screen
                    name="MenuBarbearia"
                    component={MenuBarbearia}
                    options={{ headerTitle: "Menu da Barbearia" }}
                    />
                    <Stack.Screen
                    name="HorariosBarbearia"
                    component={HorariosBarbearia}
                    options={{ headerTitle: "Horários" }}
                    />
                    <Stack.Screen
                    name="CategoriasServico"
                    component={CategoriasServico}
                    options={{ headerTitle: "Categorias" }}
                    />
                    <Stack.Screen
                    name="Servicos"
                    component={Servicos}
                    options={{ headerTitle: "Serviços" }}
                    />
                    <Stack.Screen
                    name="DadosServico"
                    component={DadosServico}
                    options={{ headerTitle: "Dados do Serviço" }}
                    />
                    <Stack.Screen
                    name="Barbeiros"
                    component={Barbeiros}
                    options={{ headerTitle: "Barbeiros" }}
                    />
                    <Stack.Screen
                    name="MenuBarbeiro"
                    component={MenuBarbeiro}
                    options={{ headerTitle: "Menu do Barbeiro" }}
                    />
                    <Stack.Screen
                    name="DadosBarbeiro"
                    component={DadosBarbeiro}
                    options={{ headerTitle: "Dados do Barbeiro" }}
                    />
                    <Stack.Screen
                    name="ServicosBarbeiro"
                    component={ServicosBarbeiro}
                    options={{ headerTitle: "Serviços vinculados" }}
                    />
                    <Stack.Screen
                    name="AgendamentoBarbearia"
                    component={AgendamentoBarbearia}
                    options={{ headerTitle: "Agendamento - Barbearia" }}
                    />
                    <Stack.Screen
                    name="AgendamentoServico"
                    component={AgendamentoServico}
                    options={{ headerTitle: "Agendamento - Serviço" }}
                    />
                    <Stack.Screen
                    name="AgendamentoBarbeiro"
                    component={AgendamentoBarbeiro}
                    options={{ headerTitle: "Agendamento - Barbeiro" }}
                    />
                    <Stack.Screen
                    name="AgendamentoHorario"
                    component={AgendamentoHorario}
                    options={{ headerTitle: "Agendamento - Horário" }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    )
}

export default Routes;