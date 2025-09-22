import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import ReimbursementList from '@/components/reimbursement-list';

export default function HomeScreen() {
  const handleAddNew = () => {
    router.push('/reimbursement');
  };

  const handleItemPress = (item: any) => {
    // Navigate to detail screen or show detail modal
    console.log('Item pressed:', item);
  };

  return (
    <View style={styles.container}>
      <ReimbursementList 
        onAddNew={handleAddNew}
        onItemPress={handleItemPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
