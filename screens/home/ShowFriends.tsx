import { View, Text, SafeAreaView, StatusBar, Pressable } from 'react-native'
import { useGetFriendsQuery } from 'features/friends/friendsApi'
import Splash from 'components/Splash'
import { FlatList } from 'react-native'

const ShowFriends = () => {
  const {data, isLoading, isSuccess, isError} = useGetFriendsQuery()

  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {isLoading ? <Splash /> :
      (
        data && (
          data.length === 0 ? (
            <View className='mx-2 my-16 flex-1 flex justify-between'>
              <Text className='text-2xl font-bold text-center'>Hozirda do'stlaringiz mavjud emas !</Text>
              <View className='flex-row justify-center'>
                <Pressable className='rounded-full w-32 h-32 bg-blue-500 flex justify-center items-center'>
                  <Text className='text-white text-xl'>+ Qo'shish</Text>
                </Pressable>
              </View>
            </View>
          ):
          (
            <FlatList
              data={data}
              renderItem={({item, index}) => (
                <View key={index} className='px-4 py-2 flex-row justify-between'>
                  <View>
                    <Text className='text-xl font-bold'>{item.name}</Text>
                    <Text className='text-md text-gray-500'>{item.username}</Text>
                  </View>
                  <View></View>
                </View>
              )
              }
              ListHeaderComponent={
                <View>
                  <Text className='text-3xl mt-4 font-bold'>Do'stlaringiz :</Text>
                </View>
              }
            />
          )
        )
      )
      }
    </SafeAreaView>
  )
}

export default ShowFriends