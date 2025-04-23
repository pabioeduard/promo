import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import LikeDislikeButtons from "../components/LikeDislikeButtons";
import CustomDialog from "../components/CustomDialog";

export default function HomeScreen() {
  const [promocoes, setPromocoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, "promocoes"), orderBy("criadoEm", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        criadoEm: doc.data().criadoEm?.toDate(),
        likes: Array.isArray(doc.data().likes) ? doc.data().likes : [],
        dislikes: Array.isArray(doc.data().dislikes) ? doc.data().dislikes : [],
      }));

      setPromocoes(lista);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <FlatList
          data={promocoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate("Detalhe", item)}>
              <View style={styles.card}>
                <Text style={styles.data}>
                  {item.criadoEm?.toLocaleString("pt-BR")}
                </Text>

                <View style={styles.cardContent}>
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: item.foto }} style={styles.image} />
                    <LikeDislikeButtons
                      promoId={item.id}
                      likes={item.likes}
                      dislikes={item.dislikes}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.titulo} numberOfLines={2}>
                      {item.titulo}
                    </Text>
                    <Text style={styles.descricao} numberOfLines={3}>
                      {item.descricao}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.vazio}>Nenhuma promoção encontrada.</Text>
          }
        />
      )}

      <CustomDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        title="Atenção"
        message=""
        buttonLabel="Fechar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  imageContainer: {
    width: "38%",
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: 90,
    borderRadius: 8,
  },
  likesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    width: "80%",
  },
  count: {
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
  },
  textContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 14,
  },
  descricao: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 4,
  },
  data: {
    position: "absolute",
    top: 8,
    right: 12,
    fontSize: 12,
    color: "#9CA3AF",
  },
  vazio: {
    textAlign: "center",
    color: "#999",
    marginTop: 30,
  },
});
