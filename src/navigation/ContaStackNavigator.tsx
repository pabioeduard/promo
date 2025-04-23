import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CadastroScreen from "../screens/CadastroScreen";
import ContaScreen from "../screens/ContaScreen";
import LoginScreen from "../screens/LoginScreen";

export type HomeStackParamList = {
  Conta: undefined;
  Cadastro: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Entrar" }} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: "Cadastro" }} />
      <Stack.Screen name="Conta" component={ContaScreen} options={{ title: "Minha conta" }} />
    </Stack.Navigator>
  );
}