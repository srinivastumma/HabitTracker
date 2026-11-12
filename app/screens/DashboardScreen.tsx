import {
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { Habit } from '../types/Habit';

import HabitItem from '../components/HabitItem';
import ProgressCard from '../components/ProgressCard';

type DashboardScreenProps = {
  habits: Habit[];
  onToggleHabit: (id: number) => void;
};

const DashboardScreen = ({
  habits,
  onToggleHabit,
}: DashboardScreenProps) => {
  const completedCount = habits.filter(habit => habit.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <ProgressCard
              completed={completedCount}
              total={habits.length}
            />
            <Text style={styles.sectionTitle}>
              Today's Habits
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <HabitItem
            habit={item}
            onToggle={onToggleHabit}
          />
        )}
        contentContainerStyle={styles.content}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F4FA',
  },

  content: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#222222',
  },

});

export default DashboardScreen;