import React from 'react';
import { Text, StyleSheet } from 'react-native';

// Define an array of 26 colors
const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33', '#8C33FF',
  '#33FFD2', '#D233FF', '#FF3347', '#33FF8A', '#7D33FF', '#FFC433',
  '#33CFFF', '#B633FF', '#FF3384', '#33FF5B', '#FF5733', '#33FFF1',
  '#FF33AC', '#8AFF33', '#FF3355', '#33A1FF', '#A133FF', '#33FF99',
  '#FF5733', '#33FFDD'
];

// Function to convert hex color to RGBA with 0.17 opacity
const hexToRgba = (hex, opacity) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgba(${r},${g},${b},${opacity})`;
};

const rgbaColors = colors.map(color => hexToRgba(color, 0.17));

// Function to get color based on the first letter
const getColor = (letter) => {
  const index = letter.toUpperCase().charCodeAt(0) - 65;
  return colors[index % colors.length];
};

const getBgColor = (letter) => {
  const index = letter.toUpperCase().charCodeAt(0) - 65;
  return rgbaColors[index % rgbaColors.length];
};

// Exportable component
const DisplayNameWithColor = ({ displayName, children }) => {
  const firstLetter = displayName.charAt(0);
  const bgColor = getBgColor(firstLetter);
  const color = getColor(firstLetter);

  return (
    <Text style={[styles.displayName, { backgroundColor: bgColor, color: color }]}>
      {displayName}
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  displayName: {
    padding: 10,
    borderRadius: 5,
  },
});

export default DisplayNameWithColor;
