import { View, Text, SafeAreaView, StatusBar } from 'react-native'
import React from 'react'

const Competition = () => {
  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex-1'>
        <Text className='text-4xl font-bold'>Home</Text>
      </View>
    </SafeAreaView>
  )
}

export default Competition