import { useEffect, useState, useCallback } from 'react'
import Splash from 'components/Splash'
import {
  ActivityIndicator,
  FlatList,
  TextInput,
  View,
  Text,
  StatusBar,
  Pressable,
  Alert,
} from 'react-native'
import {
  useCancelFriendshipRequestMutation,
  useGetFriendsQuery,
  useGetMyFriendshipRequestsQuery,
  useLazySearchFriendsQuery,
  useSendFriendshipRequestMutation,
  useUnfriendMutation,
} from 'features/friends/friendsApi'
import DynamicModal from 'components/DynamicModal'
import { Friend } from 'types/friend'
import { Button } from 'components/Button'
import { debounce } from 'lodash'
import Toast from 'react-native-toast-message'
import { AnimatedFriendItem } from 'components/AnimatedFriendItem'
import { UserMinusIcon, XMarkIcon } from 'react-native-heroicons/solid'
import { ScrollView } from 'react-native-gesture-handler'

const ShowFriends = () => {
  const { data: friends, isLoading } = useGetFriendsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const { data: myRequests, isLoading: myRequestsLoading } = useGetMyFriendshipRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const [unfriend, {isLoading: unfriendLoading}] = useUnfriendMutation()
  const [cancelFriendshipRequest, {isLoading: cancelFriendLoading}] = useCancelFriendshipRequestMutation()

  const [modalShowed, setModalShowed] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [searchData, setSearchData] = useState<Friend[]>([])

  const [searchFriend, { data: searchedFriendData, isFetching }] = useLazySearchFriendsQuery()
  const [sendFriendRequest, { isSuccess: isSuccessFriendship, isError: isErrorFriendship }] =
    useSendFriendshipRequestMutation()

  const closeModal = () => {
    setSearchText('')
    setSearchData([])
    setModalShowed(false)
  }

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      searchFriend({ query: text, ts: Date.now() })
    }, 500),
    []
  )

  useEffect(() => {
    if (searchText.length > 3) debouncedSearch(searchText)
    else setSearchData([])

    return () => debouncedSearch.cancel()
  }, [searchText])

  useEffect(() => {
    if (searchedFriendData) setSearchData(searchedFriendData)
  }, [searchedFriendData])

  useEffect(() => {
    if (isSuccessFriendship) {
      Toast.show({ type: 'success', text1: "Taklif yuborildi!" })
      closeModal()
    } else if (isErrorFriendship) {
      Toast.show({ type: 'error', text1: "Taklif yuborilmadi!" })
      closeModal()
    }
  }, [isSuccessFriendship, isErrorFriendship])

  const removeFriend = (friend: Friend) => {
    Alert.alert(
      'Amalni tasdiqlang',
      'Rostdan ushbu foydalanuvchi bilan do\'stlikni bekor qilmoqchimisiz ?',
      [
        {text: 'Ortga', style: 'cancel', onPress: () => {}},
        {text: 'Ha', onPress: async () => {
            await unfriend(friend.id).unwrap()
            .then(() => {
              Toast.show({
                type: 'success',
                text1: "Bajarildi",
                text2: `${friend.name} do'stlarlardan olib tashlandi`
              })
            })
            .catch(() => {
              Toast.show({
                type: 'error',
                text1: "Xatolik yuz berdi"
              })
            })
          }
        }
      ]
    )
  }

  const cancelRequest = (requestId: number) => {
    const func = async () => {
      await cancelFriendshipRequest(requestId).unwrap()
      .then(() => {
        Toast.show({
          type: 'info',
          text1: "So'rovingiz bekor qilindi !",
        })
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          text1: "Xatolik yuz berdi"
        })
      })
    }
    func()
  }

  if (isLoading || unfriendLoading || cancelFriendLoading) return <Splash />

  return (
    <View className="flex-1 mx-2">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex-1'>
        <ScrollView className='flex-1 pb-36'>
          {friends && friends.length === 0 ? (
            <Text className="text-3xl font-bold my-16 text-center">
              Hozirda do'stlaringiz mavjud emas!
            </Text>
          ) : (
              <View>
                <Text className="text-3xl mt-4 font-bold mb-4">Do'stlaringiz:</Text>
                {
                  friends?.map((item) => (
                    <View key={item.id} className="px-4 py-2 flex-row justify-between items-center bg-slate-200 rounded-lg mb-1">
                      <AnimatedFriendItem friend={item} />
                      <UserMinusIcon size={36} color={'red'} onPress={() => removeFriend(item)} />
                    </View>
                  ))
                }
              </View>
          )}

          {!myRequestsLoading && myRequests && myRequests.length > 0 && (
            <View>
              <Text className="text-3xl mt-4 font-bold mb-4 text-center">Sizning takliflaringiz:</Text>
              {
                myRequests.map((item) => (
                  <View key={item.id} className="px-4 py-2 flex-row justify-between items-center bg-slate-200 rounded-lg mb-1">
                    <AnimatedFriendItem friend={item.receiver} />
                    <Text className='bg-green-400 py-1 px-2 text-md rounded-lg'>Tasdiqlashi kutilmoqda</Text>
                    <XMarkIcon size={36} color={'red'} onPress={() => cancelRequest(item.id)}/>
                  </View>
                ))
              }
            </View>
          )}
        </ScrollView>
        <View className="flex items-center absolute bottom-6 mt-4 left-1/2 -translate-x-1/2">
          <Pressable
            className="rounded-full w-28 h-28 bg-blue-500 justify-center items-center"
            onPress={() => setModalShowed(true)}
          >
            <Text className="text-white text-lg">+ Qo'shish</Text>
          </Pressable>
        </View>
      </View>

      <DynamicModal visible={modalShowed}>
        <View>
          <View className="relative mb-2">
            <TextInput
              className="px-4 py-2 text-lg border-2 border-indigo-500 rounded-lg pr-10"
              placeholder="Qidirish..."
              onChangeText={setSearchText}
              value={searchText}
            />
            {isFetching && (
              <View className="absolute right-3 top-3">
                <ActivityIndicator size="small" color="#007AFF" />
              </View>
            )}
          </View>

          {searchText.length > 0 && searchData.length > 0 ? (
            <FlatList
              className="mt-2 max-h-60"
              data={searchData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View className="px-4 py-2 flex-row justify-between mb-1">
                  <AnimatedFriendItem friend={item} />
                  <Pressable
                    onPress={() => sendFriendRequest(item.id)}
                    className="bg-blue-500 px-4 py-2 rounded-lg ml-2 justify-center"
                  >
                    <Text className="text-white text-sm">Taklif yuborish</Text>
                  </Pressable>
                </View>
              )}
            />
          ) : (
            <View className="p-8">
              <Text className="text-center font-bold">
                {searchText.length > 0 ? "Hech kim topilmadi!" : "Qidirish uchun yozing"}
              </Text>
            </View>
          )}

          <Button
            title="Yopish"
            className="bg-slate-500 self-center p-2 rounded-lg mt-4"
            onPress={closeModal}
          />
        </View>
      </DynamicModal>

      {(unfriendLoading || cancelFriendLoading) && <Splash />}
    </View>
  )
}

export default ShowFriends
