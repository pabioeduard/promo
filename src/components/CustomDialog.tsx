import React from "react";
import { StyleSheet } from "react-native";
import { Dialog, Portal, Paragraph, Button } from "react-native-paper";

type CustomDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
  buttonText?: string;
};

export default function CustomDialog({
  visible,
  onDismiss,
  title,
  message,
  buttonText = "Fechar",
}: CustomDialogProps) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title style={styles.title}>{title}</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={styles.message}>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor="#ea580c" onPress={onDismiss}>
            {buttonText}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: "#fff7ed", 
    borderRadius: 12,
  },
  title: {
    color: "#ea580c", 
    fontWeight: "bold",
    fontSize: 18,
  },
  message: {
    color: "#111827", 
    fontSize: 16,
  },
});
