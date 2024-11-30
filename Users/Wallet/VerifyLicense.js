import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const LicenseInfoPage = () => {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issueDate, setIssueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleVerification = () => {
    // Dispatch the action with licenseNumber and issueDate
    dispatch(verifyLicense({ licenseNumber, issueDate }))
      .then((response) => {
        // Handle success if needed
        console.log("Verification successful:", response);
      })
      .catch((error) => {
        // Handle error if needed
        console.error("Verification failed:", error.message);
      });
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setIssueDate(date);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>License Number</Text>
        <TextInput
          style={styles.input}
          value={licenseNumber}
          onChangeText={(text) => setLicenseNumber(text)}
          placeholder="Enter License Number"
          placeholderTextColor={`${"#000000"}60`}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Issue Date</Text>
        <TouchableOpacity onPress={showDatePickerModal}>
          <Text>{issueDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={issueDate}
            mode="datetime"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <TouchableOpacity style={styles.buttonClick} onPress={handleVerification}>
        <Text style={[styles.buttonText, { fontFamily: "Bold", color: "#fff" }]}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 32,
    backgroundColor: "#fff",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#121212",
    fontFamily: "Regular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#00000060",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    height: 48,
    color: "#000000",
  },
  buttonClick: {
    backgroundColor: "#515FDF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Bold",
    fontSize: 16,
  },
});

export default LicenseInfoPage;
