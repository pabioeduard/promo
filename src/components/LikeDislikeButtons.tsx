import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db, auth } from "../services/firebaseConfig";
import CustomDialog from "./CustomDialog";

interface Props {
  promoId: string;
  likes: string[];
  dislikes: string[];
}

export default function LikeDislikeButtons({ promoId, likes, dislikes }: Props) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const userId = auth.currentUser?.uid;

  const userLiked = likes.includes(userId || "");
  const userDisliked = dislikes.includes(userId || "");

  const handleLike = async () => {
    if (!auth.currentUser) return setDialogVisible(true);
    const uid = auth.currentUser.uid;
    const ref = doc(db, "promocoes", promoId);

    await updateDoc(ref, {
      likes: userLiked ? arrayRemove(uid) : arrayUnion(uid),
      dislikes: arrayRemove(uid),
    });
  };

  const handleDislike = async () => {
    if (!auth.currentUser) return setDialogVisible(true);
    const uid = auth.currentUser.uid;
    const ref = doc(db, "promocoes", promoId);

    await updateDoc(ref, {
      dislikes: userDisliked ? arrayRemove(uid) : arrayUnion(uid),
      likes: arrayRemove(uid),
    });
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleLike}>
          <AntDesign
            name="like1"
            size={22}
            color={userLiked ? "#f97316" : "#9CA3AF"}
          />
          <Text style={styles.count}>{likes.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDislike}>
          <AntDesign
            name="dislike1"
            size={22}
            color={userDisliked ? "#f97316" : "#9CA3AF"}
          />
          <Text style={styles.count}>{dislikes.length}</Text>
        </TouchableOpacity>
      </View>

      <CustomDialog
        visible={dialogVisible}
        onDismiss={() => setDialogVisible(false)}
        title="Atenção"
        message="Você precisa estar logado para interagir."
        buttonLabel="Entrar"
        onButtonPress={() => {
          setDialogVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
