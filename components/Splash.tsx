import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Splash = () => {
  return (
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};

export default Splash;
