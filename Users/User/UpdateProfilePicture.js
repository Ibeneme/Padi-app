import React, { useState } from "react";
import { View, Text, Button, Image, Alert, StyleSheet } from "react-native";
import { launchCamera } from "react-native-image-picker";
import axios from "axios";
import { NEW_BASE_URL } from "../../Redux/NewBaseurl/NewBaseurl";

const UpdateProfilePicture = () => {
  const [imageUri, setImageUri] = useState(null); // State to store the image URI
  const [isUploading, setIsUploading] = useState(false);

  const userId = "673d640bb3db1d9ea558d405"; // Replace with dynamic userId if needed
  const endpoint = `${NEW_BASE_URL}/api/backblaze/update-profile/${userId}`;

  // Function to handle camera launch
  const openCamera = () => {
    const options = {
      mediaType: "photo",
      cameraType: "back",
      quality: 0.8,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log("Camera operation canceled");
      } else if (response.errorCode) {
        console.error("Camera error: ", response.errorMessage);
        Alert.alert("Error", "Unable to access the camera.");
      } else if (response.assets && response.assets.length > 0) {
        const photo = response.assets[0];
        setImageUri(photo.uri); // Save the URI of the captured image
      }
    });
  };

  // Function to handle image upload
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("Error", "No image selected.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: `profile_${Date.now()}.jpg`,
    });

    try {
      const response = await axios.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsUploading(false);
      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully.");
        console.log("Updated user data: ", response.data.user);
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading image: ", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's Get to Know you</Text>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.placeholderText}>No image selected</Text>
        )}
      </View>
      <Button title="Open Camera" onPress={openCamera} />
      <Button
        title={isUploading ? "Uploading..." : "Upload Image"}
        onPress={uploadImage}
        disabled={isUploading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    color: "#999",
    textAlign: "center",
  },
});

export default UpdateProfilePicture;