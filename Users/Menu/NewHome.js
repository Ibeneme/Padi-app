import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
// import FontAwesome5 from "@expo/vector-icons";
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {fetchUserProfile} from '../../Redux/Users/User';
import Icon from 'react-native-remix-icon';
import VerifyBadge from '../Components/VerifyBadge';
import CustomSvg from '../Components/VerifyBadge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchUser, fetchUserById} from '../../Redux/Auth/Auth';
import {deletePost, fetchPosts} from '../../Redux/Auth/Post';
///import Icon from "react-native-remix-icon";

const NewHome = () => {
  const [expandedItems, setExpandedItems] = useState([]);
  const toggleItemExpansion = postId => {
    if (expandedItems.includes(postId)) {
      setExpandedItems(expandedItems.filter(id => id !== postId));
    } else {
      setExpandedItems([...expandedItems, postId]);
    }
  };

  function formatTimestamp(timestamp) {
    const currentDate = new Date();
    const postDate = new Date(timestamp);

    const timeDifference = currentDate - postDate;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hrs ago`;
    } else if (minutes > 0) {
      return `${minutes} mins ago`;
    } else {
      return `${seconds} secs ago`;
    }
  }

  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
    setItemPost('');
  };

  const dispatch = useDispatch();
  const posts = useSelector(state => state.post.posts);
  const isLoadingPosts = useSelector(state => state.post.isLoadingPosts);
  const [userProfile, setUserProfile] = useState('');
  const [postData, setPosts] = useState([]);
  const {isLoading} = useSelector(state => state.user);

  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [itemPost, setItemPost] = useState('');

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
              setUserProfile(response?.payload);
            })
            .catch(error => {
              //  console.log(error);
            });
        } catch (error) {
          console.error('Error fetching user data from AsyncStorage:', error);
        }
      };

      getUserData();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      dispatch(fetchPosts())
        .then(response => {
          console.log(
            response?.payload,
            'response?.payload?response?.payload?',
          );
          setPosts(response?.payload?.posts);
        })
        .catch(error => {
          console.log(error);
        });
    }, [dispatch]),
  );

  useEffect(() => {
    if (isLoading === true) {
      dispatch(fetchPosts())
        .then(response => {
          console.log(response?.payload?.data?.post_details, 'posts');
        })
        .catch(error => {
          //   console.log(error);
        });
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPosts())
      .then(response => {
        // console.log(response?.payload?.data?.post_details, "posts");
      })
      .catch(error => {
        //console.log(error);
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPosts())
      .then(response => {
        // console.log(response?.payload, "posts");
        setPosts(response?.payload?.posts);
      })
      .catch(error => {
        // console.log(error);
      });
  }, [dispatch]);

  //console.log(posts, "postsposts");
  const fetchingAllPost = () => {
    dispatch(fetchPosts())
      .then(response => {
        setPosts(response?.payload?.posts);
        setModalVisible(false);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeletePost = postId => {
    setDeleteLoading(true);
    console.log(postId, 'posttt');
    dispatch(deletePost(postId))
      .then(response => {
        //fetchingAllPost();
        setDeleteLoading(false);
        console.log('Delete Post Response:', response);
        fetchingAllPost();
      })
      .catch(error => {
        console.log('Delete Post Error:', error);
        setDeleteLoading(false);
      });
  };

  const handleEllipsisPress = postId => {
    setModalVisible(true);
    console.log('Post ID:', postId);
    setItemPost(postId);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#f4f4f4',
        flex: 1,
        flexGrow: 1,
        // paddingLeft: 16,
        // paddingRight: 16,
        paddingTop: 16,
        paddingBottom: 24,
        height: '100%',
        marginBottom: -96,
      }}>
      <ScrollView
        style={{
          padding: 12,
          // position: "relative",
        }}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 12,
            borderRadius: 12,
            gap: 4,
            marginTop: 6,
            height: 65,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View>
            <Text
              style={{fontSize: 14, fontFamily: 'Plus Jakarta Sans SemiBold'}}>
              👋 {''}Hello, {userProfile.first_name}
            </Text>
          </View>
          <TouchableOpacity
            style={{position: 'relative', width: 28, height: 28}}>
            <Icon
              name="notification-line"
              size={18}
              style={{position: 'absolute', left: 0, top: 8}}
              color="#000000" // Specify the color of the icon
            />
            <View
              style={{
                backgroundColor: 'red',
                width: 14,
                height: 14,
                borderRadius: 20,
                top: 4,
                left: -4,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Bold',
                  fontSize: 13,
                  color: '#ffffff',
                }}></Text>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <FlatList
            data={postData?.slice()?.reverse()}
            keyExtractor={(item, index) => index?.toString()}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: 12,
                  backgroundColor: 'white',
                  borderRadius: 6,
                  marginTop: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                    }}>
                    <Text
                      style={{
                        fontWeight: '700',
                        fontFamily: 'Plus Jakarta Sans SemiBold',
                        fontSize: 12,
                      }}>
                      {item?.admin === true
                        ? 'Padiman Route Admin'
                        : '*********'}{' '}
                    </Text>
                    {item?.admin && (
                      <View style={{marginLeft: -8}}>
                        <VerifyBadge />
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 8,
                      gap: 4,
                    }}>
                    <Text style={styles.postTime}>
                      {formatTimestamp(item?.createdAt)}
                    </Text>
                    <Icon
                      name="more-line"
                      onPress={() => handleEllipsisPress(item?._id)}
                      size={14}
                      color="#000000"
                    />
                  </View>
                </View>
                <View style={{marginTop: 0}}>
                  <Text
                    style={[
                      styles.displayTag,
                      {marginBottom: 18, fontSize: 14},
                    ]}>
                    {expandedItems.includes(item?._id)
                      ? item?.text
                      : item?.text?.slice(0, 300)}
                    {item?.text?.length > 300 && (
                      <Text
                        style={{color: 'blue'}}
                        onPress={() => toggleItemExpansion(item?._id)}>
                        {expandedItems.includes(item?._id)
                          ? '       See Less'
                          : '       See More'}
                      </Text>
                    )}
                  </Text>
                </View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={isModalVisible}
                  onRequestClose={closeModal}>
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContainerView}>
                      <TouchableOpacity
                        style={[
                          styles.views,
                          {
                            backgroundColor: '#ffffff20',
                            padding: 14,
                            borderRadius: 12,
                          },
                        ]}
                        onPress={() => {
                          //  console.log(itemPost, 'postIDpostID');
                          navigation.navigate('createPost', {
                            postID: item?._id,
                          });

                          setModalVisible(false);
                        }}>
                        <Text style={styles.ellipsis}>Edit Post</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.views,
                          {
                            backgroundColor: '#ffffff20',
                            padding: 14,
                            marginTop: -16,
                            borderRadius: 12,
                          },
                        ]}
                        onPress={() => handleDeletePost(itemPost)}>
                        <Text style={styles.ellipsis}>
                          {deleteLoading ? `Deleting.....  ` : 'Delete Post'}{' '}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.views,
                          {
                            backgroundColor: '#ffffff20',
                            padding: 14,
                            marginTop: -16,
                            borderRadius: 12,
                          },
                        ]}
                        onPress={closeModal}>
                        <Text style={styles.ellipsis}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          />
        </View>

        {/* <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 12,
            padding: 12,
            backgroundColor: "white",
            borderRadius: 6,
            marginTop: 12,
          }}
        >
          <View
          
              style={{
                flexDirection: "row",
                marginTop: 8,
                gap: 4,
   
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 12,
            padding: 12,
            backgroundColor: "white",
            borderRadius: 6,
            marginTop: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Image
                style={{
                  width: 48,
                  height: 48,
                }}
                source={{
                  uri: "https://res.cloudinary.com/dqa2jr535/image/upload/v1696037944/profile_nnh2lc.png",
                }}
              />
              <View>
                <Text style={styles.displayName}>Ibeneme Ikenna</Text>
                <Text style={styles.displayTag}>@ibeneme_ikenna</Text>
              </View>
            </View>
            <View
      
              uri: "https://res.cloudinary.com/dqa2jr535/image/upload/v1696030288/redcharlie-redcharlie1-vGbC6mOeUCw-unsplash_1_j4vajm.png",
            }}
          /> 
          <Text style={[styles.displayTag, { marginBottom: 18 }]}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </Text>
        </View> */}
      </ScrollView>

      <View
        style={{
          position: 'fixed',
          bottom: 135,
          left: '84%',
          backgroundColor: '#515FDF',
          width: 48,
          height: 48,
          borderRadius: 220,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon
          name="add-line"
          onPress={() => navigation.navigate('createPost')}
          size={24}
          color="#ffffff"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: '#00000050',
    flex: 1,
    flexGrow: 1,
    bottom: 0,
    position: 'relative',
  },
  modalContainerView: {
    paddingTop: 32,
    paddingBottom: 96,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    backgroundColor: '#515FDF',
    borderRadius: 21,
    padding: 16,
    gap: 24,
    // alignItems: "center",
    //justifyContent: "center",
  },
  views: {
    color: 'white',
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  ellipsis: {
    color: 'white',
    fontFamily: 'Plus Jakarta Sans Regular',
    fontSize: 13,
    textAlign: 'left',
  },
  displayName: {
    fontSize: 13,
    fontFamily: 'Plus Jakarta Sans SemiBold',
    color: '#515FDF',
  },
  displayTag: {
    fontSize: 12,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: 'gray',
  },
  postTime: {
    fontSize: 12,
    fontFamily: 'Plus Jakarta Sans Regular',
    color: 'gray',
  },
});

export default NewHome;
