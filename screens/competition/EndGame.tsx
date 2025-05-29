import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParamList } from 'navigation'
import { ScrollView } from 'react-native-gesture-handler'
import { AnimatedFriendItem } from 'components/AnimatedFriendItem'
import { CheckIcon, TrophyIcon } from 'react-native-heroicons/solid'
import { Button } from 'components/Button'

type NavigationProps = StackScreenProps<RootStackParamList, 'EndGame'>

const EndGame: React.FC<NavigationProps> = ({route, navigation}) => {
  const {result, usersCount} = route.params

  const setNumber = (index: number) => {
    if (index === 0){
      return <TrophyIcon size={24} color={'blue'}/>
    }
    else{
      return <Text className='text-3xl'>{index+1}.</Text>
    }
  }

  return (
    <View className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView className='flex-1'>
        <View className='py-8'>
          <Text className='text-3xl font-bold text-center'>Bellashuv yakunlandi !</Text>
          <Text className='mt-4 text-blue-400 text-xl'>Ishtirokchilar soni {usersCount} ta</Text>
        </View>
        {
          result.map((item, index) => (
            <View key={item.user.id} className='flex-row items-center justify-between p-4 bg-blue-200 rounded-lg mx-4 mb-4'>
              <View className='flex-row items-center gap-2'>
                {setNumber(index)}
                <AnimatedFriendItem friend={item.user}/>
              </View>
              <View className='flex-row gap-1 items-center'>
                <Text className='text-xl'>{item.point}</Text>
                <CheckIcon color={'green'} size={24} />
              </View>
            </View>
          ))
        }
        <View className='flex items-center mt-12'>
          <Button
            title='Ortga'
            className='px-8 py-4 rounded-lg bg-blue-500'
            onPress={() => {navigation.goBack()}}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default EndGame