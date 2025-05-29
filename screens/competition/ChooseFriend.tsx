import { View, Text, StatusBar, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useGetFriendsQuery } from 'features/friends/friendsApi'
import { AnimatedFriendItem } from 'components/AnimatedFriendItem'
import { UserMinusIcon, UserPlusIcon } from 'react-native-heroicons/solid'
import Splash from 'components/Splash'
import { Friend } from 'types/friend'
import Toast from 'react-native-toast-message'
import { RootStackParamList } from 'navigation'
import { StackScreenProps } from '@react-navigation/stack'
import { useCreateGameMutation } from 'features/game/gameApi'
import { ErrorType } from 'types/other'
import { ScrollView } from 'react-native-gesture-handler'

type NavigationProps = StackScreenProps<RootStackParamList, 'ChooseFriend'>;

const ChooseFriend: React.FC<NavigationProps> = ({navigation, route}) => {
  const { data: friends, isLoading } = useGetFriendsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [createGame] = useCreateGameMutation()

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const selectUserHandler = (user: Friend) => {
    if (selectedUsers.includes(user.username)){
      setSelectedUsers(selectedUsers.filter(item => item !== user.username))
      Toast.show({
        type: 'info',
        text1: `${user.name} o'chirildi`,
        visibilityTime: 500
      })
      
    }else{
      setSelectedUsers([...selectedUsers, user.username])
      Toast.show({
        type: 'success',
        text1: `${user.name} qo'shildi`,
        visibilityTime: 500
      })
    }
  }

  const createHandler = () => {
    const func = async () => {
      if (selectedUsers.length === 0){
        Toast.show({
          type: 'info',
          text1: 'Kamida bitta do\'stingizni tanlang',
          visibilityTime: 1000
        }) 
      }
      else{
        await createGame({users: selectedUsers}).unwrap()
        .then((data) => {
          Toast.show({
            type: 'success',
            text1: 'O\'yin yaratildi',
            visibilityTime: 2000
          })
        navigation.replace('WaitTheGame',
          {
            usersStatus: data.users_status,
            game: data.game
          }
        )
        })
        .catch((error) => {
          const err: ErrorType = error
          if (err.status === 400){
            Toast.show({
              type: 'error',
              text1: "O'yinni yaratib bo'lmadi",
              text2: err.data.message,
              visibilityTime: 2000
            })
          }
          return
        })
      }
    }
    func()
  }

  if (isLoading) return <Splash />

  return (
    <View className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex-1 pb-36'>
        <ScrollView>
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
            <View>
              <View>
                <Text className="text-3xl mt-4 font-bold mb-8">Do'stlaringizni tanlang :</Text>
                <Text className='text-2xl mb-8 font-semibold text-center'>Tanlanganlar soni : {selectedUsers.length}</Text>
              </View>
              {friends?.map((item) => (
                <View key={item.id} className="px-4 py-2 flex-row justify-between items-center bg-slate-200 rounded-lg mb-1">
                  <AnimatedFriendItem friend={item} />
                  <Pressable onPress={() => selectUserHandler(item)}>
                    {
                      selectedUsers.includes(item.username) ? 
                      <UserMinusIcon size={36} color={'red'}/>
                      :
                      <UserPlusIcon size={36} color={'green'}/>
                    }
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <View className="flex items-center absolute bottom-6 left-1/2 -translate-x-1/2">
          <Pressable
            className="rounded-lg px-8 py-4 bg-blue-500 justify-center items-center"
            onPress={createHandler}
          >
            <Text className="text-white text-lg">Yaratish</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default ChooseFriend