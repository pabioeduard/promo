import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomDialog from "../components/CustomDialog";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [etapa, setEtapa] = useState<"email" | "senha">("email");
  const [carregando, setCarregando] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMensagem, setDialogMensagem] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Tabs" as never);
      }
    });
    return unsubscribe;
  }, []);

  const mostrarErro = (mensagem: string) => {
    setDialogMensagem(mensagem);
    setDialogVisible(true);
  };

  const handleAvancar = () => {
    if (!email) {
      mostrarErro("Por favor, preencha o e-mail.");
      return;
    }
    setCarregando(true);

    setTimeout(() => {
      setCarregando(false);
      setEtapa("senha");
    }, 300);
  };

  const handleLogin = async () => {
    if (!senha) {
      mostrarErro("Digite a senha.");
      return;
    }

    setCarregando(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigation.reset({
        index: 0,
        routes: [{ name: "Conta" as never }],
      });
    } catch (error: any) {
      let mensagem = "Erro ao fazer login.";

      if (error.code === "auth/user-not-found") {
        mensagem = "Usuário não encontrado. Verifique seu e-mail.";
      } else if (error.code === "auth/wrong-password") {
        mensagem = "Senha incorreta. Tente novamente.";
      } else if (error.code === "auth/invalid-email") {
        mensagem = "E-mail inválido. Verifique e tente novamente.";
      }

      mostrarErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}    >
      <View style={styles.innerContainer}>
        <Text style={styles.logo}>PromoFácil</Text>

        <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" editable={etapa === "email"}
        />

        {etapa === "senha" && (
          <TextInput style={styles.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
        )}

        <TouchableOpacity style={styles.botao} onPress={etapa === "email" ? handleAvancar : handleLogin} disabled={carregando}        >
          {carregando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.botaoTexto}>
              {etapa === "email" ? "Avançar" : "Acessar"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Cadastro" as never)}        >
          <Text style={{ color: "#f97316", textAlign: "center", marginTop: 12 }}>
            Não tem conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rodape}>
        <Text style={styles.copy}>v0.4.5.1</Text>
      </View>

      <CustomDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        title="Atenção"
        message={dialogMensagem}
        buttonLabel="Fechar"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 24,
  },
  innerContainer: {
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f97316",
    textAlign: "center",
    marginBottom: 48,
  },
  input: {
    height: 52,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9fafb",
  },
  botao: {
    backgroundColor: "#f97316",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  rodape: {
    paddingVertical: 16,
    alignItems: "center",
  },
  copy: {
    fontSize: 12,
    color: "#d1d5db",
  },
});
