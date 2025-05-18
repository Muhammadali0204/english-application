import './global.css';

import 'react-native-gesture-handler';

import RootStack from './navigation';
import { Provider, useDispatch } from 'react-redux';
import { store } from 'app/store';
import Toast from 'react-native-toast-message';
import { useEffect } from 'react';
import { connectSocket } from 'features/ws/websocketSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  return (
    <Provider store={store}>
        <RootStack />
        <Toast />
    </Provider>
  )
}
