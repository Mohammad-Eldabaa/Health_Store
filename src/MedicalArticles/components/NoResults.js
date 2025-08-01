import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoResults = () => (
  <View style={styles.container}>
    <Text style={styles.title}>لم يتم العثور على مقالات</Text>
    <Text style={styles.text}>جرب البحث بكلمات مختلفة أو اختر فئة أخرى</Text>
  </View>
);

export default NoResults;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 6,
  },
  text: {
    color: '#757575',
    textAlign: 'center',
  },
});
