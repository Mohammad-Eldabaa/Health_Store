import React from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ searchTerm, setSearchTerm, onVoiceSearch }) => (
  <View style={styles.wrapper}>
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="ابحث في المقالات الطبية..."
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholderTextColor="#aaa"
        textAlign="right"
      />

      <TouchableOpacity onPress={onVoiceSearch}>
        <Ionicons name="mic-outline" size={24} color="#0097a7" />
      </TouchableOpacity>
    </View>
  </View>
);

export default SearchBar;

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 15,
    backgroundColor: '#f6f6f6',
  },
  inputContainer: {
    flexDirection: 'row-reverse', // لعكس الاتجاه RTL
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 15,
    color: '#333',
    writingDirection: 'rtl',
  },
});


// import React from 'react';
// import { TextInput, StyleSheet, View } from 'react-native';

// const SearchBar = ({ searchTerm, setSearchTerm }) => (
//   <View style={styles.wrapper}>
//     <TextInput
//       placeholder="ابحث في المقالات الطبية..."
//       style={styles.input}
//       value={searchTerm}
//       onChangeText={setSearchTerm}
//     />
//   </View>
// );

// export default SearchBar;

// const styles = StyleSheet.create({
//   wrapper: {
//     paddingHorizontal: 16,
//     paddingBottom: 8,
//         paddingTop: 30,

//     backgroundColor: '#f6f6f6',
//   },
//   input: {
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     backgroundColor: '#fff',
//     textAlign: 'right',
//     writingDirection: 'rtl',
//   },
// });
