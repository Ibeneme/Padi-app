import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

export const YearDropdown = ({selectedYear, onYearChange}) => {
  const years = [];
  for (let year = 2023; year <= 2040; year++) {
    years.push({label: year.toString(), value: year.toString()});
  }

  return (
    <Dropdown
      itemTextStyle={{
        fontSize: 13,
        color: `#666`,
        fontFamily: 'Plus Jakarta Sans Regular',
      }}
      itemContainerStyle={{
        backgroundColor: '#ffffff',
      }}
      maxHeight={500}
      labelField="label"
      valueField="value"
      placeholderTextColor="#1e1e1e45"
      placeholderStyle={{
        fontFamily: 'Plus Jakarta Sans Regular',
        fontSize: 13,
        color: '#666',
      }}
      style={[
        styles.textInput,
        {
          borderColor: '#66666665',
          borderWidth: 0.6,
          color: '#666',
          fontSize: 13,
        },
      ]}
      //style={styles.dropdown}
      data={years}
      placeholder="Year"
      //placeholderTextColor="#1e1e1e45"
      value={selectedYear}
      onChange={value => onYearChange(value)}
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
    console.log(selectedYear?.value, 'selectedYear');
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

export const ThreeDropdownss = ({onYearChange, onMonthChange, onDayChange}) => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const handleYearChange = value => {
    setSelectedYear(value);
    onYearChange(value); // Pass the selected year to the parent component
  };

  const handleMonthChange = value => {
    setSelectedMonth(value);
    onMonthChange(value); // Pass the selected month to the parent component
  };

  const handleDayChange = value => {
    setSelectedDay(value);
    onDayChange(value); // Pass the selected day to the parent component
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
    borderWidth: 0.7,
    borderColor: '#808080',
  },
});

export default ThreeDropdownss;
