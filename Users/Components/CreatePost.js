import React, {useState} from 'react';
import {
  SafeAreaView,
  Image,
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {createPost, updatePost} from '../../Redux/Auth/Post'; // Assuming you have updatePost action
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUserById} from '../../Redux/Auth/Auth';

const CreatePost = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const route = useRoute();

  // Extract postID from route params
  const {postID} = route.params || {};
  const {userProfile} = useSelector(state => state.user); // Assuming user profile is in `user`

  console.log(inputValue, 'inputValue');

  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userIdProfile, setUserIdProfile] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      const getUserData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('user_id');
          const storedAccessToken = await AsyncStorage.getItem('access_token');
          setUserId(storedUserId);
          setAccessToken(storedAccessToken);
          console.log(storedUserId, 'storedUserId');

          dispatch(fetchUserById(storedUserId))
            .then(response => {
              console.log('dispatcheddispatched', response?.payload);
              setUserIdProfile(response?.payload);
            })
            .catch(error => {
              // console.log(error);
            });
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };

      getUserData();
    }, []),
  );

  const handleTextChange = text => {
    setInputValue(text);
    setCharCount(text.length);
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
      multiple: true,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        if (response.assets && response.assets.length > 0) {
          const images = response.assets.map(asset => asset.uri);
          setSelectedImages(images);
        }
      }
    });
  };

  const handleCreateOrUpdatePost = () => {
    if (!inputValue.trim()) {
      alert('Post content cannot be empty.');
      return;
    }

    setLoading(true);

    const postData = {
      text: inputValue,
      userId: userId,
      last_name: userProfile?.last_name,
      first_name: userProfile?.first_name, // Ensure user profile contains an ID
    };

    if (postID) {
      // If postID exists, update the post
      postData.id = postID;
      if (selectedImages.length > 0) {
        postData.images = selectedImages; // Include images if selected
      }
      console.log(postData, 'postDatapostData');
      dispatch(updatePost(postData)) // Trigger updatePost reducer
        .then(response => {
          setLoading(false);
          console.log(response, 'responseresponseresponse');
          if (response?.payload?.message === 'Post updated successfully') {
            navigation.navigate('Home'); // Navigate back to the previous screen
          } else {
            alert(response?.payload?.message || 'Failed to update post.');
          }
        })
        .catch(error => {
          setLoading(false);
          console.error('Error updating post:', error);
          alert('An error occurred while updating the post.');
        });
    } else {
      // If no postID, create a new post
      postData.first_name = userIdProfile?.first_name;
      postData.last_name = userIdProfile?.last_name;

      if (selectedImages.length > 0) {
        postData.images = selectedImages; // Include images if selected
      }

      console.log(postData, 'postDatapostData');

      dispatch(createPost(postData)) // Trigger createPost reducer
        .then(response => {
          setLoading(false);
          if (response?.payload?.message === 'Post created successfully') {
            navigation.navigate('Home'); // Navigate back to the previous screen
          } else {
            alert(response?.payload?.message || 'Failed to create post.');
          }
        })
        .catch(error => {
          setLoading(false);
          console.error('Error creating post:', error);
          alert('An error occurred while creating the post.');
        });
    }
  };

  const width = useWindowDimensions().width;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleCreateOrUpdatePost}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadButtonText}>Upload</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {borderColor: charCount > 1000 ? 'red' : 'white'},
            ]}
            placeholder="Type something..."
            value={inputValue}
            onChangeText={handleTextChange}
            multiline
          />
          <Text
            style={[
              styles.charCount,
              {color: charCount > 1000 ? 'red' : 'gray'},
            ]}>
            {charCount}/1000
          </Text>
        </View>
      </View>

      <View style={styles.imagePickerContainer}>
        <TouchableOpacity
          style={styles.imagePickerButton}
          onPress={handleImagePicker}>
          <Text style={styles.imagePickerButtonText}>
            {selectedImages.length > 0 ? 'Change Photo' : 'Add Image'}
          </Text>
        </TouchableOpacity>
        <View style={styles.imagePreview}>
          {selectedImages.map((image, index) => (
            <Image key={index} source={{uri: image}} style={styles.image} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    fontFamily: 'Plus Jakarta Sans Medium',
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: '#515FDF',
    height: 48,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  uploadButtonText: {
    fontFamily: 'Plus Jakarta Sans Bold',
    fontSize: 14,
    color: 'white',
  },
  content: {
    flex: 1,
    margin: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
    borderRadius: 6,
    minHeight: 150,
    padding: 8,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  charCount: {
    fontFamily: 'Plus Jakarta Sans Medium',
    fontSize: 12,
    marginTop: 4,
  },
  imagePickerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  imagePickerButton: {
    backgroundColor: '#515FDF25',
    padding: 16,
    borderRadius: 24,
  },
  imagePickerButtonText: {
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 14,
    color: '#515FDF',
  },
  imagePreview: {
    flexDirection: 'row',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
});

export default CreatePost;
