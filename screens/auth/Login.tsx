import { View, Text, TextInput, Alert } from 'react-native'
import { Button } from 'components/Button'
import { RootStackParamList } from 'navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { useState } from 'react';
import { authApi, useLoginMutation } from 'features/auth/authApi';
import Splash from '../../components/Splash';
import Toast from 'react-native-toast-message';
import { setAccessToken } from 'utils/calculations';
import { useDispatch } from 'react-redux';
import { socketService } from 'app/services/socketService';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch()

  const handleLogin = async () => {
    if (username !== '' && password !== '') {
      if (username.length < 5) {
        Toast.show({
          type: 'error',
          text1: 'Usernameda xatolik',
          text2: 'Username kamida 5 ta belgidan iborat !'
        })
        return
      }
      if (password.length < 6) {
        Toast.show({
          type: 'error',
          text1: 'Parolda xatolik',
          text2: 'Parol kamida 6 ta belgidan iborat !'
        })
        return
      }
      try {
        const result = await login({ username: username.trim(), password: password.trim() }).unwrap();
        setAccessToken(result.token)
        Toast.show({
          type: 'success',
          text1: 'Muvaffaqiyatli kirish',
          text2: 'Xush kelibsiz'
        })
        dispatch(authApi.util.resetApiState())
        navigation.reset({
          index: 0,
          routes: [{name: "TabNavigator"}]
        })
      } catch (err: any) {
        if (err.status === 422 || err.status === 401) {
          Toast.show({
            type: 'error',
            text1: 'Xatolik',
            text2: "Username yoki parol noto'g'ri !"
          })
        }else if(err.status === 404){
          Toast.show({
            type: 'error',
            text1: 'Xatolik',
            text2: "Bunday foydalanuvchi mavjud emas !"
          })
        }
        else{
          Toast.show({
            type: 'error',
            text1: 'Xatolik',
            text2: 'Nimadir xato ketdi'
          })
        }
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Xatolik',
        text2: 'Foydalanuvchi nomi yoki parolni to\'ldiring'
      })
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  if (isLoading) {
    return <Splash />
  }

  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-4xl font-bold'>Kirish</Text>
      <TextInput
        className='border border-gray-300 rounded-md p-2 w-80 mt-4'
        placeholder='Username'
        onChangeText={setUsername}
        value={username} />
      <TextInput
        className='border border-gray-300 rounded-md p-2 w-80 mt-4'
        placeholder='Parol'
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password} />
      <Button title='Kirish' onPress={handleLogin} className='mt-6 px-12 py-6 rounded-3xl'/>
      <Text className='mt-8 text-xl'>Agar hisobingiz bo'lmasa{' '}
        <Text className='text-blue-500' onPress={handleSignup}>Ro'yxatdan o'ting</Text>
      </Text>
    </View>
  )
}

export default Login
