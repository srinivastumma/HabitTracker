
import React, { useMemo, useRef, useEffect } from 'react';

import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  type ListRenderItem,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { localDateString } from '../utils/date';

const ITEM_WIDTH = 58;
const ITEM_GAP = 8;

const DAYS_BEFORE = 30;
const DAYS_AFTER = 30;

type DateItem = {
  id: string;
  date: Date;
  day: number;
  weekday: string;
  isToday: boolean;
};

type DateSelectorProps = {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  style?: StyleProp<ViewStyle>;
};

function generateDates(): DateItem[] {
  const today = new Date();

  today.setHours(12, 0, 0, 0);

  const dates = [];

  for (
    let i = -DAYS_BEFORE;
    i <= DAYS_AFTER;
    i++
  ) {
    const date = new Date(today);

    date.setDate(today.getDate() + i);

    dates.push({
      id: localDateString(date),
      date: date,
      day: date.getDate(),

      weekday: date.toLocaleDateString(
        'en-US',
        { weekday: 'short' }
      ),

      isToday:
        localDateString(date) ===
        localDateString(today)
    });
  }

  return dates;
}

export default function DateSelector({
  selectedDate,
  onSelectDate,
  style,
}: DateSelectorProps) {

  const flatListRef = useRef<FlatList<DateItem>>(null);

  const dates = useMemo(
    () => generateDates(),
    []
  );

  // Automatically scroll to today's date
  useEffect(() => {

    const timer = setTimeout(() => {

      flatListRef.current?.scrollToIndex({

        index: DAYS_BEFORE,

        animated: false,

        viewPosition: 0.5

      });

    }, 100);

    return () => clearTimeout(timer);

  }, []);

  const renderDate: ListRenderItem<DateItem> = ({ item }) => {

    const isSelected =
      item.id === selectedDate;

    return (

      <Pressable

        onPress={() => onSelectDate(item.id)}

        style={[
          styles.dateItem,
          isSelected && styles.selectedDate
        ]}

      >

        <Text
          style={[
            styles.weekday,
            isSelected && styles.selectedText
          ]}
        >
          {item.weekday}
        </Text>

        <Text
          style={[
            styles.day,
            isSelected && styles.selectedText
          ]}
        >
          {item.day}
        </Text>

        {item.isToday && (

          <View
            style={[
              styles.todayDot,
              isSelected && styles.selectedDot
            ]}
          />

        )}

      </Pressable>

    );

  };

  const handleGoToToday = () => {
    onSelectDate(localDateString());
    flatListRef.current?.scrollToIndex({
      index: DAYS_BEFORE,
      animated: true,
      viewPosition: 0.5,
    });
  };

  return (

    <View style={[styles.container, style]}>

      <View style={styles.header}>

        <Text style={styles.heading}>
          Choose a date
        </Text>

        <Pressable
          onPress={handleGoToToday}
        >

          <Text style={styles.todayButton}>
            Go to Today
          </Text>

        </Pressable>

      </View>

      <FlatList

        ref={flatListRef}

        horizontal

        data={dates}

        renderItem={renderDate}

        keyExtractor={item => item.id}

        showsHorizontalScrollIndicator={false}

        initialScrollIndex={DAYS_BEFORE}

        getItemLayout={(data, index) => ({

          length: ITEM_WIDTH + ITEM_GAP,

          offset:
            (ITEM_WIDTH + ITEM_GAP) * index,

          index

        })}

        contentContainerStyle={styles.list}

      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    width: '100%',
    marginBottom: 16
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },

  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b'
  },

  todayButton: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 13
  },

  list: {
    paddingRight: 10
  },

  dateItem: {
    width: ITEM_WIDTH,
    height: 76,
    marginRight: ITEM_GAP,
    borderRadius: 14,
    backgroundColor: '#e8edf5',
    alignItems: 'center',
    justifyContent: 'center'
  },

  selectedDate: {
    backgroundColor: '#2563eb'
  },

  weekday: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600'
  },

  day: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172554',
    marginTop: 3
  },

  selectedText: {
    color: '#ffffff'
  },

  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#2563eb',
    position: 'absolute',
    bottom: 5
  },

  selectedDot: {
    backgroundColor: '#ffffff'
  }

});
