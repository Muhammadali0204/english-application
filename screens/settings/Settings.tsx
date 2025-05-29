import { Text, View, TextInput } from 'react-native'
import { Button } from 'components/Button'
import { StatusBar } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { clearUser, setUser } from 'features/auth/authSlice'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from 'navigation'
import { useNavigation } from '@react-navigation/native'
import { RootState } from 'app/store'
import { setAccessToken } from 'utils/calculations'
import Toast from 'react-native-toast-message'
import { authApi, useChangeNameMutation, useChangePasswordMutation, useLazyGetMeQuery } from 'features/auth/authApi'
import { socketService } from 'app/services/socketService'
import DynamicModal from 'components/DynamicModal'
import { useEffect, useState } from 'react'

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Settings = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user)
  const [modalShowed, setModalShowed] = useState<boolean>(false)
  const [modalType, setModalType] = useState<'chpass' | 'chname' | null>(null)
  const [newName, setNewName] = useState<string>('')
  const [newPass, setNewPass] = useState<string>('')
  const [newPass2, setNewPass2] = useState<string>('')

  const [triggerGetMe] = useLazyGetMeQuery();
  const [changePassRequest, {isSuccess: chPassSuccess, isError: chPassError}] = useChangePasswordMutation()
  const [changeNameRequest, {isSuccess: chNameSuccess, isError: chNameError}] = useChangeNameMutation()


  const resetUser = async () => {
    try {
      const user = await triggerGetMe().unwrap();
      dispatch(setUser(user));
    } catch (e) {
      console.error("GetMe error from WS:", e);
    }
  }


  const handleLogout = () => {
    const func = async () => {
      dispatch(clearUser())
      setAccessToken(null)
      dispatch(authApi.util.resetApiState())
      socketService.close()
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

  const changeName = () => {
    setModalType('chname')
    setModalShowed(true)
  }

  const changePassword = () => {
    setModalType('chpass')
    setModalShowed(true)
  }

  const closeModal = () => {
    setNewName('')
    setNewPass('')
    setNewPass2('')
    setModalShowed(false)
  }

  const sendRequest = () => {
    if (modalType === 'chname'){
      if (newName.length < 3) {
        Toast.show({
          type: 'error',
          text1: 'Ismda xatolik',
          text2: 'Ismingiz kamida 3 ta belgidan iborat bo\'lishi kerak'
        })
        return
      }
      changeNameRequest({newName: newName})
      closeModal()
    }else if (modalType === 'chpass'){
      if (newPass !== newPass2){
        Toast.show({
          type: 'error',
          text1: "Xato",
          text2: "Parollar bir-biriga mos emas",
          visibilityTime: 2000
        })
        return
      }
      if (newPass.length < 6) {
        Toast.show({
          type: 'error',
          text1: 'Parolda xatolik',
          text2: 'Parol kamida 6 ta belgidan iborat !'
        })
        return
      }
      changePassRequest({newPass: newPass})
      closeModal()
    }
  }

  useEffect(() => {
    if (chPassSuccess){
      Toast.show({
        type: 'success',
        text1: "Bajarildi",
        text2: "Parol o'zgartirildi",
        visibilityTime: 2000
      })
    }
    if (chPassError){
      Toast.show({
        type: 'error',
        text1: "Xatolik",
        text2: "Parol o'zgarmadi",
        visibilityTime: 2000
      })
    }
  }, [chPassSuccess, chPassError])

  useEffect(() => {
    const func = async () => {
      if (chNameSuccess){
        Toast.show({
          type: 'success',
          text1: "Bajarildi",
          text2: "Ismingiz o'zgartirildi",
          visibilityTime: 2000
        })
      }
      if (chNameError){
        Toast.show({
          type: 'error',
          text1: "Xatolik",
          text2: "Ismingiz o'zgarmadi",
          visibilityTime: 2000
        })
      }
      await resetUser()
    }
    func()
  }, [chNameSuccess, chNameError])

  return (
    <View className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex-1'>
        <View className='mx-4 mt-4 p-4 bg-slate-50 border border-indigo-300 rounded-lg'>
          <Text className='font-bold text-xl'>Ismingiz : <Text className='text-blue-500'>{user?.name}</Text></Text>
          <Text className='font-bold text-xl'>Username'ingiz : <Text className='text-blue-600'>{user?.username}</Text></Text>
        </View>
        <Text className='mx-4 px-4 py-6 font-bold text-xl bg-indigo-400 rounded-lg mt-4'
          onPress={changeName}
        >Ismni o'zgartirish</Text>
        <Text className='mx-4 px-4 py-6 font-bold text-xl bg-indigo-400 rounded-lg mt-4'
          onPress={changePassword}
        >Parolni o'zgartirish</Text>
        <View className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button
            title='Chiqish'
            onPress={handleLogout}
            className='px-12 py-6 rounded-3xl bg-red-500' />
        </View>
      </View>
      <DynamicModal visible={modalShowed}>
        {
          modalType === 'chname' ? 
          <View>
            <Text className='text-2xl mb-4 font-bold'>Yangi ism kiriting :</Text>
            <TextInput
              className="px-4 py-2 text-lg border-2 border-indigo-500 rounded-lg"
              placeholder="Ism kiriting"
              onChangeText={setNewName}
              value={newName}
            />
          </View>
          :
          <View>
            <Text className='text-2xl mb-4 font-bold'>Yangi parol kiriting :</Text>
            <TextInput
              className="px-4 py-2 text-lg border-2 border-indigo-500 rounded-lg mb-4"
              placeholder="Yangi parolni kiriting"
              onChangeText={setNewPass}
              value={newPass}
            />
            <TextInput
              className="px-4 py-2 text-lg border-2 border-indigo-500 rounded-lg"
              placeholder="Yangi parolni qayta kiriting"
              onChangeText={setNewPass2}
              value={newPass2}
            />
          </View>
        }
        <View className='flex-row justify-between'>
          <Button
            title="Yopish"
            className="bg-slate-500 self-center p-2 rounded-lg mt-4"
            onPress={closeModal}
          />
          <Button
            title="Yuborish"
            className="bg-blue-500 self-center p-2 rounded-lg mt-4"
            onPress={sendRequest}
          />
        </View>
      </DynamicModal>
    </View>
  )
}

export default Settings