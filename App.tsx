import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "./src/contexts/AuthContext";
import * as Updates from "expo-updates";
import Toast from "react-native-root-toast";

export default function App() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    async function checkUpdates() {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setUpdateAvailable(true);
        }
      } catch (e) {
        console.log("Erro ao buscar atualizações:", e);
      }
    }

    checkUpdates();
  }, []);

  const handleUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (e) {
      console.log("Erro ao atualizar:", e);
    }
  };

  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        {updateAvailable &&
          Toast.show("Nova versão disponível", {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            backgroundColor: "#111827",
            textColor: "#f97316",
            onHidden: () => setUpdateAvailable(false),
            onPress: handleUpdate,
          })}
      </PaperProvider>
    </AuthProvider>
  );
}
