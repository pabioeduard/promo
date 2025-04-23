import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
import CustomDialog from "../components/CustomDialog";

export default function CadastroScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  const [mostrarTermos, setMostrarTermos] = useState(false);
  const [mostrarPolitica, setMostrarPolitica] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMensagem, setDialogMensagem] = useState("");

  const handleCadastro = async () => {
    if (!nome || !email || !telefone || !senha) {
      setDialogMensagem("Preencha todos os campos.");
      setDialogVisible(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      const { uid } = userCredential.user;

      await setDoc(doc(db, "usuarios", uid), {
        nome,
        email,
        telefone,
        criadoEm: new Date(),
        uid,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: "Conta" as never }],
      });
    } catch (error: any) {
      console.log(error);
      setDialogMensagem("Erro ao cadastrar: " + error.message);
      setDialogVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Criar conta</Text>
      <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="E-mail" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Telefone" style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
      <TextInput placeholder="Senha" style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />

      <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>

      <Text style={styles.textoTermos}>
        Ao continuar, você concorda com nossos{" "}
        <Text style={styles.linkTermos} onPress={() => setMostrarTermos(true)}>Termos de Uso</Text>{" "}
        e{" "}
        <Text style={styles.linkTermos} onPress={() => setMostrarPolitica(true)}>Política de Privacidade</Text>
        .
      </Text>

      <CustomDialog
        visible={dialogVisible}
        title="Aviso"
        message={dialogMensagem}
        onDismiss={() => setDialogVisible(false)}
      />
      <CustomDialog
        visible={mostrarTermos}
        title="Termos de uso"
        message="Ao usar o PromoFácil, você concorda em utilizar o app de forma responsável. As promoções são de terceiros e podem mudar sem aviso prévio."
        onDismiss={() => setMostrarTermos(false)}
        buttonText="Fechar"
      />

      <CustomDialog
        visible={mostrarPolitica}
        title="Política de privacidade"
        message="Levamos segurança muito a sério. Seus dados são protegidos e usados apenas conforme necessário. Você pode consultar mais detalhes ou solicitar a exclusão a qualquer momento."
        onDismiss={() => setMostrarPolitica(false)}
        buttonText="Fechar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#111827",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  botao: {
    backgroundColor: "#f97316",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  textoTermos: {
    fontSize: 12,
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
    paddingHorizontal: 8,
  },
  linkTermos: {
    color: "#f97316",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
