import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GreetingHeader= () => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Good morning!
      </Text>

      <Text style={styles.subtitle}>
        Let's build good habits today.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
});

export default GreetingHeader;