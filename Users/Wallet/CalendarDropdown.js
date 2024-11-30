import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

export const YearDropdown = ({selectedYear, onYearChange}) => {
  const currentYear = new Date().getFullYear();
  const years = [
    {label: currentYear.toString(), value: currentYear.toString()},
    {label: (currentYear + 1).toString(), value: (currentYear + 1).toString()},
  ];

  return (
    <Dropdown
      style={styles.dropdown}
      data={years}
      placeholder="Year"
      placeholderTextColor="#1e1e1e45"
      value={selectedYear}
      onChange={value => onYearChange(value)}
      itemTextStyle={{
        fontSize: 13,
        color: `#121212`,
        fontFamily: 'Plus Jakarta Sans Regular',
      }}
      itemContainerStyle={{
        backgroundColor: '#fff',
      }}
      labelField="label"
      valueField="value"
    />
  );
};

export const MonthDropdown = ({selectedMonth, onMonthChange}) => {
  const months = [
    {label: 'January', value: '1'},
    {label: 'February', value: '2'},
    {label: 'March', value: '3'},
    {label: 'April', value: '4'},
    {label: 'May', value: '5'},
    {label: 'June', value: '6'},
    {label: 'July', value: '7'},
    {label: 'August', value: '8'},
    {label: 'September', value: '9'},
    {label: 'October', value: '10'},
    {label: 'November', value: '11'},
    {label: 'December', value: '12'},
  ];

  return (
    <Dropdown
      style={styles.dropdown}
      data={months}
      placeholder="Month"
      placeholderTextColor="#1e1e1e45"
      value={selectedMonth}
      onChange={value => onMonthChange(value)}
      labelField="label"
      valueField="value"
      itemTextStyle={{
        fontSize: 13,
        color: `#121212`,
        fontFamily: 'Plus Jakarta Sans Regular',
      }}
    />
  );
};

export const DayDropdown = ({
  selectedMonth,
  selectedYear,
  selectedDay,
  onDayChange,
}) => {
  const [days, setDays] = useState([]);

  useEffect(() => {
    const updateDays = () => {
      let maxDay;
      if (selectedMonth?.value === '2' && selectedYear?.value) {
        const isLeapYear =
          (selectedYear?.value % 4 === 0 && selectedYear?.value % 100 !== 0) ||
          selectedYear?.value % 400 === 0;
        maxDay = isLeapYear ? 29 : 28;
      } else if (['4', '6', '9', '11'].includes(selectedMonth?.value)) {
        maxDay = 30;
      } else {
        maxDay = 31;
      }
      const newDays = Array.from({length: maxDay}, (_, i) => ({
        label: (i + 1).toString(),
        value: (i + 1).toString(),
      }));
      setDays(newDays);
    };

    updateDays();
  }, [selectedMonth, selectedYear]);

  return (
    <Dropdown
      style={styles.dropdown}
      data={days}
      placeholderTextColor="#1e1e1e45"
      placeholder="Day"
      value={selectedDay}
      onChange={value => onDayChange(value)}
      labelField="label"
      valueField="value"
      itemTextStyle={{
        fontSize: 13,
        color: `#121212`,
        fontFamily: 'Plus Jakarta Sans Regular',
      }}
    />
  );
};

export const ThreeDropdowns = ({onYearChange, onMonthChange, onDayChange}) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const handleYearChange = value => {
    setSelectedYear(value);
    onYearChange(value);
  };

  const handleMonthChange = value => {
    setSelectedMonth(value);
    onMonthChange(value);
  };

  const handleDayChange = value => {
    setSelectedDay(value);
    onDayChange(value);
  };

  const formatDate = () => {
    const year = selectedYear.value;
    const month = selectedMonth.value;
    const day = selectedDay.value;
    console.log(`${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`);
    return `${year}-${month?.padStart(2, '0')}-${day?.padStart(2, '0')}`;
  };

  const formattedDate = formatDate();

  return (
    <View style={styles.container}>
      <YearDropdown
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />
      <MonthDropdown
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
      />
      <DayDropdown
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedDay={selectedDay}
        onDayChange={handleDayChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dropdown: {
    width: '32%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    fontFamily: 'Plus Jakarta Sans Regular',
    borderWidth: 0.5,
    borderColor: '#808080',
    fontSize: 13,
    height: 55,
    marginTop: 4,
  },
});

export default ThreeDropdowns;
