import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ArticleCard = ({ article }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <Image source={{ uri: article.image }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.category}>{article.category}</Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.excerpt}>{article.excerpt}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>
            📅 {new Date(article.date).toLocaleDateString('ar-EG')}
          </Text>
          <Text style={styles.metaText}>⏱️ {article.readTime}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.author}>👤 {article.author}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ArticleDetails', { article })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>قراءة المزيد</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ArticleCard;


const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
  },
  infoContainer: {
    padding: 12,
  },
  category: {
    backgroundColor: '#009688',
    color: 'white',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'right',
  },
  excerpt: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    textAlign: 'right',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#757575',
    textAlign:'right'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 13,
    color: '#757575',
  },
  button: {
    backgroundColor: '#00BCD4',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  fullContent: {
    marginTop: 10,
    fontSize: 14,
    color: '#444',
    textAlign: 'right',
    lineHeight: 22,
  },
});
