import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

type Props = {
  completed: number;
  total: number;
};

const ProgressCard = ({ completed, total }: Props) => {

  const percentage = total === 0
    ? 0
    : (completed / total) * 100;

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Today's Progress
      </Text>

      <Text style={styles.progress}>
        {completed} / {total} habits completed
      </Text>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            { width: `${percentage}%` },
          ]}
        />
      </View>

      <Text style={styles.percentage}>
        {Math.round(percentage)}% completed
      </Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7257D9',
    padding: 20,
    borderRadius: 18,
    marginVertical: 20,
  },

  heading: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  progress: {
    color: '#FFFFFF',
    marginTop: 10,
  },

  progressBackground: {
    height: 8,
    backgroundColor: '#AFA1E9',
    borderRadius: 10,
    marginTop: 18,
  },

  progressFill: {
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },

  percentage: {
    color: '#FFFFFF',
    marginTop: 10,
  },
});

export default ProgressCard;