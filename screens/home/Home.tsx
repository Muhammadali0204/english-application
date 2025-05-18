import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useGetMeQuery } from 'features/auth/authApi'
import { clearUser, setUser } from 'features/auth/authSlice'
import { RootStackParamList } from 'navigation'
import { useEffect } from 'react'
import { View, Text, SafeAreaView, StatusBar, Pressable } from 'react-native'
import Toast from 'react-native-toast-message'
import { useDispatch } from 'react-redux'
import { setAccessToken } from 'utils/calculations'
import Splash from '../../components/Splash'
import { socketService } from 'app/services/SockerService'

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Home = () => {
  const {data, error, isSuccess, isLoading} = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const dispatch = useDispatch()
  const navigation = useNavigation<NavigationProp>();

  // useEffect(() => {
  //   const onMessage = (data: any) => {
  //     Toast.show({
  //       type: 'info',
  //       text1: data.data
  //     })
  //   };

  //   socketService.subscribe(onMessage);

  //   return () => {
  //     socketService.unsubscribe(onMessage);
  //   };
  // }, []);


  useEffect(() => {
    if (error) {
      if ('status' in error) {
        if (error.status === 401) {
          Toast.show({
            type: 'error',
            text1: 'Afsuski',
            text2: 'Sizning sessiyangiz tugadi. Iltimos qayta kiring'
          })
          dispatch(clearUser());
          setAccessToken(null)
          navigation.replace('Login')
        }else{
          Toast.show({
            type: 'error',
            text1: 'Xatolik',
            text2: 'Server bilan bog\'lanishda xatolik'
          })
        }
      }
    }
  }, [data, error])

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data))
    }
  }, [isSuccess])

  const myFriends = () => {
    navigation.navigate('ShowFriends')
  }

  const handleInvites = () => {
    
  }

  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
        { isLoading ? <Splash />:
        <View className='flex-1'>
          <Text className={styles.hello_text}>Salom, {data?.name}</Text>
          <View className='flex-row justify-around mt-12'>
            <Pressable className={styles.friends_card} onPress={myFriends}>
              <Text className='text-3xl font-bold'>Do'stlaringiz</Text>
            </Pressable>
            <Pressable className={styles.invites_card} onPress={handleInvites}>
              <Text className='text-3xl font-bold'>Takliflar</Text>
              <View className={styles.invites_notification}>
                <Text className='text-2xl'>20</Text>
              </View>
            </Pressable>
          </View>
        </View>
        }
    </SafeAreaView>
  )
}

export default Home

const styles = {
  hello_text: 'mt-4 p-4 bg-slate-50 border border-l-indigo-300 rounded-lg text-2xl font-bold',
  friends_card: "bg-amber-300 rounded-xl flex items-center justify-center w-48 h-48",
  invites_card: "bg-blue-300 rounded-xl flex items-center justify-center relative w-48 h-48",
  invites_notification: 'absolute -top-3 -right-3 bg-red-500 w-12 h-12 flex rounded-full items-center justify-center'
}
