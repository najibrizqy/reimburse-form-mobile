import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface UploadedFile {
  id: string;
  name: string;
  amount: string;
  type: 'photo' | 'document';
  imageUri?: string;
}

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (file: Omit<UploadedFile, 'id'>) => void;
}

export default function UploadModal({ visible, onClose, onSubmit }: UploadModalProps) {
  const [modalNominal, setModalNominal] = useState('');
  const [modalKeterangan, setModalKeterangan] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleModalSubmit = () => {
    if (!selectedImage || !modalNominal || !modalKeterangan) {
      Alert.alert('Error', 'Please fill all fields and select an image');
      return;
    }

    const newFile = {
      name: modalKeterangan,
      amount: modalNominal,
      type: 'photo' as const,
      imageUri: selectedImage,
    };
    
    onSubmit(newFile);
    resetForm();
  };

  const resetForm = () => {
    setModalNominal('');
    setModalKeterangan('');
    setSelectedImage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#0C4886', '#157FEC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalHeader}
          >
            <Text style={styles.modalTitle}>Bukti dan Nominal</Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
          
          <View style={styles.modalBody}>
            {/* Bukti Foto Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Bukti Foto</Text>
              <TouchableOpacity style={styles.photoUploadArea} onPress={handleImagePicker}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="add" size={24} color="#ccc" />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Nominal Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Nominal</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Masukkan nominal disini"
                placeholderTextColor="#999"
                value={modalNominal}
                onChangeText={setModalNominal}
                keyboardType="numeric"
              />
            </View>

            {/* Keterangan Section */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Keterangan</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Masukkan keterangan pengajuan"
                placeholderTextColor="#999"
                value={modalKeterangan}
                onChangeText={setModalKeterangan}
                multiline
              />
            </View>
          </View>
          
          <LinearGradient
            colors={['#0C4886', '#157FEC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.modalSubmitButton}
          >
            <TouchableOpacity onPress={handleModalSubmit} style={styles.modalSubmitButtonInner}>
              <Text style={styles.modalSubmitButtonText}>Simpan</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  modalBody: {
    padding: 20,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  photoUploadArea: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 14,
    color: '#333',
  },
  modalSubmitButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  modalSubmitButtonInner: {
    padding: 16,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});