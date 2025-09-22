import { Ionicons } from '@expo/vector-icons';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import moment from 'moment';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addReimbursementItem } from '../utils/storage';
import UploadModal from './upload-modal';

interface ApprovalUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'pending' | 'approved' | 'waiting';
  date?: string;
}

export default function ReimbursementForm() {
  const [claimType, setClaimType] = useState('');
  const [detail, setDetail] = useState('');
  

  const [showClaimTypeDropdown, setShowClaimTypeDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    id: string;
    name: string;
    amount: string;
    type: 'photo' | 'document';
    imageUri?: string;
  }[]>([]);

  const claimTypes = [
    'Transportasi',
    'Makan',
    'Akomodasi',
    'Komunikasi'
  ];

  const approvalUsers: ApprovalUser[] = [
    {
      id: '1',
      name: 'Yokevin Mayer Van Persie',
      role: 'Big Boss',
      avatar: '👤',
      status: 'approved',
      date: 'Mon, 1 Jan 2024'
    },
    {
      id: '2',
      name: 'Francino Gigi Satrio',
      role: 'Medium Boss',
      avatar: '👤',
      status: 'waiting'
    }
  ];

  const [dateTitle, setDateTitle] = useState('');
  const [date, setDate] = useState(new Date());

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    const formattedDate = moment(currentDate).format('MM-DD-YYYY HH:mm:ss');
    console.log(selectedDate);
    setDateTitle(formattedDate);
    setDate(currentDate);
  };

  const showMode = (currentMode: 'date' | 'time') => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const handleSubmit = async () => {
    if (!date || !claimType || !detail) {
      Alert.alert('Error', 'Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReimbursementItem({
        title: claimType,
        amount: '',
        date: dateTitle,
        type: claimType,
        detail,
        status: 'pending'
      });
      
      Alert.alert(
        'Success', 
        'Pengajuan reimburs berhasil dikirim',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back to the list
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting reimbursement:', error);
      Alert.alert('Error', 'Gagal menyimpan pengajuan reimburs. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = () => {
    setShowUploadModal(true);
  };

  const handleModalSubmit = (file: Omit<{
    id: string;
    name: string;
    amount: string;
    type: 'photo' | 'document';
    imageUri?: string;
  }, 'id'>) => {
    const newFile = {
      id: Date.now().toString(),
      ...file,
    };
    
    setUploadedFiles(prev => [...prev, newFile]);
    setShowUploadModal(false);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
  };

  return (
    <>
      <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#0C4886', '#157FEC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengajuan Reimburs</Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Detail Pengajuan Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detail Pengajuan</Text>
          

          
          {/* Date Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Tanggal</Text>
            <TouchableOpacity style={styles.dateInput} onPress={showDatepicker}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={[styles.inputText, !date && styles.placeholder]}>
               {dateTitle ? dateTitle : `Pilih tanggal`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Claim Type Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Jenis Klaim</Text>
            <TouchableOpacity 
              style={styles.dropdownInput}
              onPress={() => setShowClaimTypeDropdown(!showClaimTypeDropdown)}
            >
              <Text style={[styles.inputText, !claimType && styles.placeholder]}>
                {claimType || 'Pilih jenis klaim'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            
            {showClaimTypeDropdown && (
              <View style={styles.dropdown}>
                {claimTypes.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setClaimType(type);
                      setShowClaimTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Detail Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Detail</Text>
            <TextInput
              style={styles.textAreaInput}
              placeholder="Masukkan detail pengajuan"
              placeholderTextColor="#999"
              value={detail}
              onChangeText={setDetail}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* File Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lampiran Bukti</Text>
          
          {/* Display uploaded files */}
          {uploadedFiles.map((file) => (
            <View key={file.id} style={styles.fileItem}>
              <View style={styles.fileIcon}>
                {file.imageUri ? (
                  <Image 
                    source={{ uri: file.imageUri }} 
                    style={styles.filePreviewImage}
                  />
                ) : (
                  <Ionicons 
                    name={file.type === 'photo' ? "image-outline" : "document-outline"} 
                    size={24} 
                    color="#3498db" 
                  />
                )}
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{file.name}</Text>
                <Text style={styles.fileAmount}>Rp{file.amount}</Text>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeFile(file.id)}
              >
                <Ionicons name="close-circle" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          ))}
          
          {/* Upload Area */}
          {
            uploadedFiles.length > 0 ?
            <TouchableOpacity style={styles.btnAddItem} onPress={handleFileUpload}>
               <Text style={styles.addText}>Tambah Item</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.uploadArea} onPress={handleFileUpload}>
              <View style={styles.iconWrapper}>
                <Image 
                  source={require('../assets/images/upload-icon.png')} 
                  style={styles.uploadIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.uploadText}>Klik untuk upload file dan isi nominal</Text>
              <Text style={styles.uploadSubtext}>PNG, JPG hingga 5MB</Text>
            </TouchableOpacity>
          }
          {/* Approval Line Section */}
          <View>
            <Text style={styles.sectionTitle}>Approval Line</Text>
            {approvalUsers.map((user) => (
              <View key={user.id} style={styles.approvalItem}>
                <View style={styles.approvalUser}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user.avatar}</Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                  </View>
                </View>
                <View style={styles.approvalStatus}>
                  {user.status === 'approved' ? (
                    <View style={styles.approvedStatus}>
                      <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                      <Text style={styles.approvedText}>{user.date}</Text>
                    </View>
                  ) : (
                    <View style={styles.waitingStatus}>
                      <Ionicons name="time-outline" size={16} color="#f39c12" />
                      <Text style={styles.waitingText}>Menunggu</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={isSubmitting}
          style={styles.submitButtonContainer}
        >
          <LinearGradient
            colors={['#0C4886', '#157FEC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Mengirim...' : 'Submit Request'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>

    <UploadModal
      visible={showUploadModal}
      onClose={closeUploadModal}
      onSubmit={handleModalSubmit}
    />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingBottom: 15,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    minHeight: 100,
    fontSize: 14,
  },
  inputText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  placeholder: {
    color: '#999',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 4,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  btnAddItem: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#E5E5E5',
    borderRadius: 6,
    paddingVertical: 8,
    marginBottom: 20,
  },
  uploadArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  iconWrapper:{
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#EDF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  uploadIcon: {
    resizeMode: 'contain',
  },
  addText: {
    fontSize: 14,
    color: '#898C92',
    fontWeight: '500',
    textAlign: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  approvalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  approvalUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  userRole: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  approvalStatus: {
    alignItems: 'flex-end',
  },
  approvedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  approvedText: {
    fontSize: 12,
    color: '#27ae60',
    marginLeft: 4,
  },
  waitingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  waitingText: {
    fontSize: 12,
    color: '#f39c12',
    marginLeft: 4,
  },
  submitButtonContainer: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  submitButton: {
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  filePreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  fileAmount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  removeButton: {
    padding: 4,
  },
});