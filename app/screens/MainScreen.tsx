import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateSelector from '../data/DateSelector';
import { localDateString } from '../utils/date';
import DashboardScreen from './DashboardScreen';
import { initialHabits } from '../data/habits';
import { Habit } from '../types/Habit';

type Tab = 'today' | 'history' | 'add';

function getRecentDates(): string[] {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    return localDateString(date);
  });
}

function MainScreen() {
  const [selectedDate, setSelectedDate] = useState(() => localDateString());
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [completedByDate, setCompletedByDate] = useState<Record<string, number[]>>(
    () => ({
      [localDateString()]: initialHabits
        .filter(habit => habit.completed)
        .map(habit => habit.id),
    }),
  );
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('✨');

  const selectedCompletedIds = completedByDate[selectedDate] ?? [];
  const selectedHabits = useMemo(
    () =>
      habits.map(habit => ({
        ...habit,
        completed: selectedCompletedIds.includes(habit.id),
      })),
    [habits, selectedCompletedIds],
  );

  const toggleHabit = (id: number) => {
    setCompletedByDate(previous => {
      const completed = new Set(previous[selectedDate] ?? []);
      if (completed.has(id)) {
        completed.delete(id);
      } else {
        completed.add(id);
      }

      return { ...previous, [selectedDate]: Array.from(completed) };
    });
  };

  const addHabit = () => {
    const title = habitName.trim();
    if (!title) return;

    const nextId = habits.reduce(
      (largestId, habit) => Math.max(largestId, habit.id),
      0,
    ) + 1;

    setHabits(previous => [
      ...previous,
      { id: nextId, title, icon: habitIcon.trim() || '✨', completed: false },
    ]);
    setHabitName('');
    setHabitIcon('✨');
    setActiveTab('today');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'today' && (
          <>
            <Text style={styles.title}>{getTimeOfDay()}</Text>
            <Text style={styles.subtitle}>Welcome to Habit Tracker</Text>
            <DateSelector
              style={styles.dateSelector}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <DashboardScreen habits={selectedHabits} onToggleHabit={toggleHabit} />
          </>
        )}

        {activeTab === 'history' && (
          <View style={styles.page}>
            <Text style={styles.pageTitle}>History</Text>
            <Text style={styles.pageSubtitle}>Your daily habit progress</Text>
            <FlatList
              data={getRecentDates()}
              keyExtractor={date => date}
              renderItem={({ item: date }) => {
                const completedCount = (completedByDate[date] ?? []).length;
                const isToday = date === localDateString();

                return (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setSelectedDate(date);
                      setActiveTab('today');
                    }}
                    style={styles.historyRow}
                  >
                    <View>
                      <Text style={styles.historyDate}>
                        {isToday
                          ? 'Today'
                          : new Date(`${date}T12:00:00`).toLocaleDateString(
                              undefined,
                              { weekday: 'short', month: 'short', day: 'numeric' },
                            )}
                      </Text>
                      <Text style={styles.historyHint}>Tap to view this day</Text>
                    </View>
                    <Text style={styles.historyCount}>
                      {completedCount} / {habits.length}
                    </Text>
                  </Pressable>
                );
              }}
              contentContainerStyle={styles.historyList}
            />
          </View>
        )}

        {activeTab === 'add' && (
          <View style={styles.page}>
            <Text style={styles.pageTitle}>Add a habit</Text>
            <Text style={styles.pageSubtitle}>Build a routine, one step at a time.</Text>
            <Text style={styles.inputLabel}>Habit name</Text>
            <TextInput
              accessibilityLabel="Habit name"
              onChangeText={setHabitName}
              placeholder="e.g. Take a daily walk"
              returnKeyType="done"
              style={styles.input}
              value={habitName}
            />
            <Text style={styles.inputLabel}>Emoji</Text>
            <TextInput
              accessibilityLabel="Habit emoji"
              maxLength={4}
              onChangeText={setHabitIcon}
              style={[styles.input, styles.emojiInput]}
              value={habitIcon}
            />
            <Pressable
              accessibilityRole="button"
              disabled={!habitName.trim()}
              onPress={addHabit}
              style={[styles.addButton, !habitName.trim() && styles.disabledButton]}
            >
              <Text style={styles.addButtonText}>Add Habit</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.navigation}>
        <NavigationButton
          label="Today"
          icon="☀"
          selected={activeTab === 'today'}
          onPress={() => setActiveTab('today')}
        />
        <NavigationButton
          label="History"
          icon="◷"
          selected={activeTab === 'history'}
          onPress={() => setActiveTab('history')}
        />
        <NavigationButton
          label="Add Habit"
          icon="+"
          selected={activeTab === 'add'}
          onPress={() => setActiveTab('add')}
        />
      </View>
    </View>
  );
}

type NavigationButtonProps = {
  label: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
};

function NavigationButton({
  label,
  icon,
  selected,
  onPress,
}: NavigationButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.navigationButton}
    >
      <Text style={[styles.navigationIcon, selected && styles.selectedNavigationText]}>
        {icon}
      </Text>
      <Text style={[styles.navigationLabel, selected && styles.selectedNavigationText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const getTimeOfDay = () => {
  const currentHour = new Date().getHours();

  if (currentHour >= 6 && currentHour < 12) {
    return 'Good Morning!';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good Afternoon!';
  } else {
    return 'Good Evening!';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FA',
  },
  content: {
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  dateSelector: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  page: {
    flex: 1,
    padding: 20,
  },
  pageTitle: {
    color: '#1E293B',
    fontSize: 26,
    fontWeight: 'bold',
  },
  pageSubtitle: {
    color: '#64748B',
    marginTop: 6,
    marginBottom: 24,
  },
  historyList: {
    paddingBottom: 16,
  },
  historyRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 16,
  },
  historyDate: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '600',
  },
  historyHint: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  historyCount: {
    color: '#7257D9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputLabel: {
    color: '#334155',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    borderWidth: 1,
    color: '#1E293B',
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  emojiInput: {
    width: 84,
    textAlign: 'center',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#7257D9',
    borderRadius: 12,
    marginTop: 8,
    padding: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navigation: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E2E8F0',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 12,
    paddingTop: 8,
  },
  navigationButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  navigationIcon: {
    color: '#64748B',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navigationLabel: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  selectedNavigationText: {
    color: '#7257D9',
  },
});

export default MainScreen;