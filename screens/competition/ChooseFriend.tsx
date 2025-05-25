import { View, Text, FlatList, SafeAreaView, StatusBar, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useGetFriendsQuery } from 'features/friends/friendsApi'
import { AnimatedFriendItem } from 'components/AnimatedFriendItem'
import { UserMinusIcon, UserPlusIcon } from 'react-native-heroicons/solid'
import Splash from 'components/Splash'
import { Friend } from 'types/friend'
import Toast from 'react-native-toast-message'
import { RootStackParamList } from 'navigation'
import { StackScreenProps } from '@react-navigation/stack'

type NavigationProps = StackScreenProps<RootStackParamList, 'FindTranslation'>;

const ChooseFriend: React.FC<NavigationProps> = ({navigation, route}) => {
  const { data: friends, isLoading } = useGetFriendsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [selectedUsers, setSelectedUsers] = useState<Friend[]>([])

  const selectUserHandler = (user: Friend) => {
    if (selectedUsers.includes(user)){
      setSelectedUsers(selectedUsers.filter(item => item !== user))
      Toast.show({
        type: 'info',
        text1: `${user.name} o'chirildi`,
        visibilityTime: 500
      })
      
    }else{
      setSelectedUsers([...selectedUsers, user])
      Toast.show({
        type: 'success',
        text1: `${user.name} qo'shildi`,
        visibilityTime: 500
      })
    }
  }

  const createHandler = () => {
    if (selectedUsers.length === 0){
      Toast.show({
        type: 'info',
        text1: 'Kamida bitta do\'stingizni tanlang',
        visibilityTime: 1000
      }) 
    }
    else{
      Toast.show({
        type: 'success',
        text1: 'O\'yin yaratildi',
        visibilityTime: 2000
      })
      navigation.replace('GameScreen')
    }
  }

  if (isLoading) return <Splash />

  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {friends && friends.length === 0 ? (
        <View>
          <Text className="text-3xl font-bold my-16 text-center">
            Hozirda do'stlaringiz mavjud emas!
          </Text>
          <Text className='text-xl font-semibold text-center'>
            Bellashuvni boshlash uchun do'stlar orttiring va ularni o'yinga taklif qiling
          </Text>
        </View>
      ) : (
        <FlatList
          className='max-h-60'
          ListHeaderComponent={
            <View>
              <Text className="text-3xl mt-4 font-bold mb-8">Do'stlaringizni tanlang :</Text>
              <Text className='text-2xl mb-8 font-semibold text-center'>Tanlanganlar soni : {selectedUsers.length}</Text>
            </View>
          }
          data={friends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="px-4 py-2 flex-row justify-between items-center bg-slate-200 rounded-lg mb-1">
              <AnimatedFriendItem friend={item} />
              <Pressable onPress={() => selectUserHandler(item)}>
                {
                  selectedUsers.includes(item) ? 
                  <UserMinusIcon size={36} color={'red'}/>
                  :
                  <UserPlusIcon size={36} color={'green'}/>
                }
              </Pressable>
            </View>
          )}
        />
      )}

      <View className="flex items-center my-4 absolute bottom-4 left-1/2 -translate-x-1/2">
          <Pressable
            className="rounded-lg px-8 py-4 bg-blue-500 justify-center items-center"
            onPress={createHandler}
          >
            <Text className="text-white text-lg">Yaratish</Text>
          </Pressable>
        </View>
    </SafeAreaView>
  )
}

export default ChooseFriend