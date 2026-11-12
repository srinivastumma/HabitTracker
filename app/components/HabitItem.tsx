import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import * as Habit from '../types/Habit';

type Props = {
  habit: Habit.Habit;
  onToggle: (id: number) => void;
};

const HabitItem = ({ habit, onToggle }: Props) => {

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle(habit.id)}
    >
      <Text style={styles.icon}>
        {habit.icon}
      </Text>

      <Text style={styles.title}>
        {habit.title}
      </Text>

      <View
        style={[
          styles.checkbox,
          habit.completed && styles.completed,
        ]}
      >
        <Text style={styles.check}>
          {habit.completed ? '✓' : ''}
        </Text>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderRadius: 12,
  },

  icon: {
    fontSize: 24,
    marginRight: 12,
  },

  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#222222',
  },

  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BBBBBB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  completed: {
    backgroundColor: '#7257D9',
    borderColor: '#7257D9',
  },

  check: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default HabitItem;