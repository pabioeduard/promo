import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ScrollView,  
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import LikeDislikeButtons from "../components/LikeDislikeButtons";

export default function DetalheScreen() {
  const route = useRoute<RouteProp<any>>();
  const promo = route.params!;


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.data}>
        {promo.criadoEm?.toDate?.().toLocaleString("pt-BR") ||
          promo.criadoEm?.toLocaleString("pt-BR")}
      </Text>
      <Image source={{ uri: promo.foto }} style={styles.image} />
      <Text style={styles.titulo}>{promo.titulo}</Text>
      <View style={styles.likesContainer}>
        <LikeDislikeButtons promoId={promo.id} likes={promo.likes} dislikes={promo.dislikes} />
      </View>
      <TouchableOpacity
        style={styles.botao}
        onPress={() => Linking.openURL(promo.link)}
      >
        <Text style={styles.botaoTexto}>Acessar promoção</Text>
      </TouchableOpacity>
      <Text style={styles.descricao}>{promo.descricao}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f8f8f8",
  },
  data: {
    textAlign: "right",
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  descricao: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 20,
    marginTop: 20,
  },
  botao: {
    backgroundColor: "#f97316",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  likesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 20,
  },
  count: {
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: "#111827",
  },
  carrosselContainer: {
    paddingBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    marginRight: 12,
    maxWidth: 200,
  },
  cardImagem: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  cardTextoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
