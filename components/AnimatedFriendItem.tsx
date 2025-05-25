import React, { useRef, useEffect } from 'react'
import { Animated, View, Text } from 'react-native'
import { Friend } from 'types/friend'


type Props = {
  friend: Friend
}

export const AnimatedFriendItem: React.FC<Props> = ({ friend }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text className='text-xl font-bold'>{friend.name}</Text>
      <Text className='text-md text-gray-500'>{friend.username}</Text>
    </Animated.View>
  )
}
