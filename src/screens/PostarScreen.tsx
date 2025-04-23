import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConfig";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import ProtectedScreen from "../components/ProtectedScreen";

type PostarScreenRouteProp = RouteProp<
  {
    Postar: {
      promo?: {
        id: string;
        titulo: string;
        descricao: string;
        link: string;
        foto: string;
      };
    };
  },
  "Postar"
>;

export default function PostarScreen() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [link, setLink] = useState("");
  const [foto, setFoto] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const navigation = useNavigation();
  const route = useRoute<PostarScreenRouteProp>();

  useEffect(() => {
    if (route.params?.promo) {
      const { promo } = route.params;
      setTitulo(promo.titulo);
      setDescricao(promo.descricao);
      setLink(promo.link);
      setFoto(promo.foto);
      setIsEditMode(true);
    }
  }, [route.params]);

  const handlePostar = async () => {
    if (!titulo || !descricao || !link) {
      Alert.alert("Preencha todos os campos!");
      return;
    }

    if (isEditMode && route.params?.promo) {
      const promoId = route.params.promo.id;
      const promoRef = doc(db, "promocoes", promoId);
      await updateDoc(promoRef, {
        titulo,
        descricao,
        link,
        foto,
      });
      Alert.alert("Promoção atualizada com sucesso!");
    } else {
      await addDoc(collection(db, "promocoes"), {
        titulo,
        descricao,
        link,
        foto,
        criadoEm: new Date(),
        usuarioId: auth.currentUser?.uid,
      });
      Alert.alert("Promoção postada com sucesso!");
    }

    setTitulo("");
    setDescricao("");
    setLink("");
    setFoto("");
    navigation.goBack();
  };

  return (
    <ProtectedScreen>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>
          {isEditMode ? "Editar promoção" : "Poste sua promoção"}
        </Text>
        <Text style={styles.subtitulo}>
          {isEditMode
            ? "Edite os detalhes da sua promoção"
            : "Compartilhe uma promoção para todos aproveitarem"}
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Título da promoção</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder=""
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Link</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={link}
            onChangeText={setLink}
          />
          <Text style={styles.label}>Foto</Text>
          <TextInput
            style={styles.input}
            placeholder=""
            value={foto}
            onChangeText={setFoto}
          />

          <TouchableOpacity style={styles.botao} onPress={handlePostar}>
            <Text style={styles.botaoTexto}>
              {isEditMode ? "Atualizar" : "Postar"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ProtectedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    color: "#111827",
  },
  subtitulo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#4B5563",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  botao: {
    backgroundColor: "#f97316",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
