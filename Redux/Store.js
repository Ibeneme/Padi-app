import {configureStore} from '@reduxjs/toolkit';
import registrationReducer from './Auth/Auth';
import userReducer from './Users/User';
import postReducer from './Auth/Post';
import deliveryReducer from './Deliveries/Deliveries';
import ridesReducer from './Ride/Ride';
import walletReducer from './Ride/Ride';
import chatReducer from './Chats/chatSlice';
import deliverParcelSliceReducer from './Auth/deliverParcelSlice';
import sendParcelSliceReducer from './Auth/sendParcelSlice';
import driverSliceReducer from './Auth/driverSlice';


const store = configureStore({
  reducer: {
    registration: registrationReducer,
    user: userReducer,
    post: postReducer,
    deliverParcelSlice: deliverParcelSliceReducer,
    sendParcelSlice: sendParcelSliceReducer,

    driverSlice: driverSliceReducer,
    delivery: deliveryReducer,
    rides: ridesReducer,
    wallet: walletReducer,
    chat: chatReducer,
  },
});

export default store;
