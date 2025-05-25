import { StackScreenProps } from '@react-navigation/stack'
import { AnimatedFriendItem } from 'components/AnimatedFriendItem'
import Splash from 'components/Splash'
import { useLazyGetMeQuery } from 'features/auth/authApi';
import { setUser } from 'features/auth/authSlice';
import { useAcceptFriendshipRequestMutation, useGetFriendshipRequestsQuery, useRejectFriendshipRequestMutation } from 'features/friends/friendsApi'
import { RootStackParamList } from 'navigation';
import React from 'react';
import { View, Text, SafeAreaView, StatusBar, FlatList } from 'react-native'
import { CheckCircleIcon, XMarkIcon } from 'react-native-heroicons/solid'
import Toast from 'react-native-toast-message'
import { useDispatch } from 'react-redux';


const ShowRequests = () => {
  const {data, isLoading, isError} = useGetFriendshipRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true
  })

  const [rejectRequest] = useRejectFriendshipRequestMutation()
  const [acceptRequest] = useAcceptFriendshipRequestMutation()
  const [triggerGetMe] = useLazyGetMeQuery();
  const dispatch = useDispatch()

  const resetUser = async () => {
    try {
      const user = await triggerGetMe().unwrap();
      dispatch(setUser(user));
    } catch (e) {
      console.error("GetMe error from WS:", e);
    }
  }

  const rejectRequestHandler = (requestId: number) => {
    const func = async () => {
      await rejectRequest(requestId)
      .then(() => {
        Toast.show({
          type: 'info',
          text1: "Rad edilldi"
        })
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: "Xatolik yuz berdi"
        })
      })
      await resetUser()
    }
    func()
  }

  const acceptRequestHandler = (requestId: number) => {
    const func = async () => {
      await acceptRequest(requestId)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: "Qabul qildingiz"
        })
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: "Xatolik yuz berdi"
        })
      })
      await resetUser()
    }
    func()
  }

  if (isLoading) return <Splash />

  return (
    <SafeAreaView className="flex-1 mx-2">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {data && data.length === 0 ? (
        <Text className="text-3xl font-bold my-16 text-center">
          Hech qanday taklif mavjud emas !
        </Text>
      ) : (
        <FlatList
          className='max-h-60'
          ListHeaderComponent={
            <Text className="text-3xl mt-4 font-bold mb-4">Takliflar :</Text>
          }
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="px-4 py-2 flex-row justify-between items-center bg-slate-200 rounded-lg mb-1">
              <AnimatedFriendItem friend={item.requester} />
              <View className='flex-row gap-4'>
                <CheckCircleIcon color={'green'} size={36} onPress={() => acceptRequestHandler(item.id)}/>
                <XMarkIcon color={'red'} size={36} onPress={() => rejectRequestHandler(item.id)}/>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

export default ShowRequests