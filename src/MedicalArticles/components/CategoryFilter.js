import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => (
  <View style={styles.container}>
    {categories.map((category) => (
      <TouchableOpacity
        key={category}
        onPress={() => setSelectedCategory(category)}
        style={[
          styles.button,
          selectedCategory === category && styles.activeButton,
        ]}
      >
        <Text
          style={[
            styles.text,
            selectedCategory === category && styles.activeText,
          ]}
        >
          {category}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default CategoryFilter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap', 
    gap: 8,
    marginTop: 12,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderColor: '#00BCD4',
    borderWidth: 1,
    margin: 4,
  },
  activeButton: {
    backgroundColor: '#00BCD4',
  },
  text: {
    color: '#00BCD4',
    fontWeight: '500',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  activeText: {
    color: 'white',
  },
});
