import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import ReimbursementForm from '@/components/reimbursement-form';

export default function ReimbursementScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <ReimbursementForm />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});