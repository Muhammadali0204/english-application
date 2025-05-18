import { Text, SafeAreaView, View } from 'react-native'
import { Button } from 'components/Button'
import { StatusBar } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser } from 'features/auth/authSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from 'navigation'
import { useNavigation } from '@react-navigation/native'
import { RootState } from 'app/store'
import { setAccessToken } from 'utils/calculations'
import Toast from 'react-native-toast-message'
import { authApi } from 'features/auth/authApi'

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Settings = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user)

  const handleLogout = () => {
    const func = async () => {
      dispatch(clearUser())
      setAccessToken(null)
      dispatch(authApi.util.resetApiState())
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}]
      })
      Toast.show({
        type: 'success',
        text1: "Muvaffaqiyatli chiqdingiz !"
      })
    }
    func()
  }

  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex-1 relative'>
        <View className='mx-4 mt-4 p-4 bg-slate-50 border border-indigo-300 rounded-lg'>
          <Text className='font-bold text-xl'>Ismingiz : <Text className='text-blue-500'>{user?.name}</Text></Text>
          <Text className='font-bold text-xl'>Username'ingiz : <Text className='text-blue-600'>{user?.username}</Text></Text>
        </View>
        <View className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button
            title='Logout'
            onPress={handleLogout}
            className='px-12 py-6 rounded-3xl' />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Settings