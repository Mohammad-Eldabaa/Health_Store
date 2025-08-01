import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const FeaturedArticle = ({ article, toggleFullContent, showFull }) => {
  if (!article) return null;

  return (
    <View style={styles.card}>
      <View style={styles.featuredIconContainer}>
<Text style={styles.featuredIcon}>⭐</Text>
</View>
      <Image source={{ uri: article.image }} style={styles.image} />
      <Text style={styles.category}>{article.category}</Text>
      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.excerpt}>{article.excerpt}</Text>

      
      <TouchableOpacity
        onPress={() => toggleFullContent(article.id)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>
          {showFull ? 'إخفاء المقال' : 'قراءة المقال كاملاً'}
        </Text>
      </TouchableOpacity>

      {showFull && <Text style={styles.content}>{article.content}</Text>}
    </View>
  );
};

export default FeaturedArticle;

const styles = StyleSheet.create({
  featuredIconContainer: {
position: 'absolute',
top: 12,
left: 10,
// backgroundColor: 'gold',
paddingHorizontal: 8,
paddingVertical: 4,
borderRadius: 20,
zIndex: 1,
},

featuredIcon: {
fontSize: 14,
// fontWeight: 'bold',
// color: 'red',
},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  category: {
backgroundColor: '#009688',
color: '#fff',
alignSelf: 'flex-start',
paddingHorizontal: 8,
paddingVertical: 4,
borderRadius: 10,
fontSize: 12,
marginBottom: 4,
textAlign: 'right',
writingDirection: 'rtl',
},
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  excerpt: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  button: {
    backgroundColor: '#00BCD4',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    marginTop: 12,
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
