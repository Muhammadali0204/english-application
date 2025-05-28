import { View, Text, TextInput, Alert } from 'react-native'
import { Button } from 'components/Button'
import { RootStackParamList } from 'navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { useState } from 'react';
import { useRegisterMutation } from 'features/auth/authApi';
import Splash from '../../components/Splash';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { setAccessToken } from 'utils/calculations';

type Props = StackScreenProps<RootStackParamList, 'Signup'>;

const Signup = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [register, { isLoading }] = useRegisterMutation();

  const handleSignup = async () => {
    if (username !== '' && password !== '' && name !== '') {
      if (username.length < 5) {
        Toast.show({
          type: 'error',
          text1: 'Usernameda xatolik',
          text2: 'Username kamida 5 ta belgidan iborat bo\'lishi kerak'
        })
        return
      }
      if (password.length < 6) {
        Toast.show({
          type: 'error',
          text1: 'Parolda xatolik',
          text2: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'
        })
        return
      }
      if (name.length < 3) {
        Toast.show({
          type: 'error',
          text1: 'Ismda xatolik',
          text2: 'Ismingiz kamida 3 ta belgidan iborat bo\'lishi kerak'
        })
        return
      }
      try {
        const result = await register({ username: username.trim(), password: password.trim(), name: name.trim() }).unwrap();
        setAccessToken(result.token)
        Toast.show({
          type: 'success',
          text1: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
          text2: 'Xush kelibsiz'
        })
        navigation.replace('TabNavigator');
      } catch (err: any) {
        if (err.status === 406) {
          Toast.show({
            type: 'error',
            text1: 'Afsuski',
            text2: "Ushbu username band !"
          })
        }else{
          Toast.show({
            type: 'error',
            text1: 'Xatolik',
            text2: "Nimadir xato ketdi",
          })
        }
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Xatolik',
        text2: 'Barcha maydonlarni to\'ldiring'
      })
    }
  };

  const handleToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  if (isLoading) {
    return <Splash />
  }

  return (
    <View className='flex-1 items-center justify-center'>
      <Text className='text-4xl font-bold'>Ro'yxatdan o'tish</Text>
      <TextInput
        className='border border-gray-300 rounded-md p-2 w-80 mt-4 text-black'
        placeholder='Username'
        onChangeText={setUsername}
        value={username} />
      <TextInput
        className='border border-gray-300 rounded-md p-2 w-80 mt-4 text-black'
        placeholder='Parol'
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password} />
      <TextInput
        className='border border-gray-300 rounded-md p-2 w-80 mt-4 text-black'
        placeholder='Ismingiz'
        onChangeText={setName}
        value={name} />
      <Button title="Ro'yxatdan o'tish" onPress={handleSignup} className='mt-6 px-12 py-6 rounded-3xl'/>
      <Text className='mt-8 text-2xl'>
        <Text className='text-blue-500' onPress={handleToLogin}>Kirish</Text>
        ga qaytish
      </Text>
    </View>
  )
}

export default Signup
