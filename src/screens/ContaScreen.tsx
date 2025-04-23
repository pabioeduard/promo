import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

export default function ContaScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [promocoes, setPromocoes] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(false);

      if (!firebaseUser) {
        navigation.navigate("Login" as never);
      } else {
        setUser(firebaseUser);
        console.log("Usuário logado:", firebaseUser.uid);

        const q = query(
          collection(db, "promocoes"),
          where("usuarioId", "==", firebaseUser.uid)
        );

        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
          console.log("Promoções carregadas:", snapshot.docs.length);
          const lista = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPromocoes(lista);
        });

        return () => unsubscribeFirestore();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate("Login" as never);
  };

  const handleEdit = (promo: any) => {
    navigation.navigate("Postar", { promo });
  };

  const handleDelete = async (promoId: string) => {
    try {
      if (promoId) {
        await deleteDoc(doc(db, "promocoes", promoId));
        setIsModalVisible(false); 
      }
    } catch (error) {
      console.error("Erro ao excluir promoção: ", error);
    }
  };

  const showModal = (promoId: string) => {
    setPromotionToDelete(promoId);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setPromotionToDelete(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Minha Conta</Text>
      <Text style={styles.email}>Email: {user.email}</Text>

      <Text style={styles.subtitulo}>Minhas Promoções</Text>
      <FlatList
        data={promocoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.promocao}>
            <Text style={styles.promocaoTitulo}>{item.titulo || 'Sem título'}</Text>
            <Text style={styles.promocaoDescricao} numberOfLines={2}>
              {item.descricao || 'Sem descrição'}
            </Text>
            <View style={styles.promocaoActions}>
              <TouchableOpacity
                onPress={() => handleEdit(item)}
                style={styles.editButton}
              >
                <AntDesign name="edit" size={20} color="#f97316" />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => showModal(item.id)}
                style={styles.deleteButton}
              >
                <AntDesign name="delete" size={20} color="#EF4444" />
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noPromotionsText}>Nenhuma promoção publicada.</Text>
        }
      />

      <TouchableOpacity onPress={handleLogout} style={styles.botaoLogout}>
        <Text style={styles.botaoTexto}>Sair</Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Tem certeza de que deseja excluir esta promoção?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => handleDelete(promotionToDelete!)}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={hideModal}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
    color: "#4B5563",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  promocao: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  promocaoTitulo: {
    fontWeight: "bold",
    fontSize: 16,
  },
  promocaoDescricao: {
    color: "#4B5563",
  },
  promocaoActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#f97316",
  },
  botaoLogout: {
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
  noPromotionsText: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 20,
  },
  // Estilo do Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#f97316",
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
