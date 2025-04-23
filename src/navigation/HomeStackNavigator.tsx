import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import DetalheScreen from "../screens/DetalheScreen";

export type HomeStackParamList = {
  Home: undefined;
  Detalhe: {
    id: string;
    titulo: string;
    descricao: string;
    link: string;
    foto: string;
  };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "PromoFácil" }} />
      <Stack.Screen name="Detalhe" component={DetalheScreen} options={{ title: "Detalhes da promoção" }} />
    </Stack.Navigator>
  );
}
