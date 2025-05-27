import { StackScreenProps } from '@react-navigation/stack';
import { socketService } from 'app/services/socketService';
import { Button } from 'components/Button';
import CountdownTimer from 'components/CountdownTimer';
import { RootStackParamList } from 'navigation';
import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, TextInput, Alert, BackHandler } from 'react-native'
import Toast from 'react-native-toast-message';
import { WebSocketMessage, WSMessageTypes } from 'types/ws';

type NavigationProps = StackScreenProps<RootStackParamList, 'GameScreen'>

const GameScreen: React.FC<NavigationProps> = ({route, navigation}) => {
  const {users_count, game} = route.params
  const [word, setWord] = useState<string[]>([])
  const [index, setIndex] = useState<number>(-1)
  const [answered, setAnswered] = useState<boolean>(false)
  const [inputData, setInputData] = useState('')

  useEffect(() => {
    const onMessage = async (data: WebSocketMessage) => {
      if (data.type === WSMessageTypes.NEXT_WORD){
        Toast.show({
          type: 'info',
          text1: "Keyingi so'z",
          visibilityTime: 1000
        })
        setIndex(data.data.index)
        setWord(data.data.word)
        setAnswered(false)
        setInputData('')
      }
      else if (data.type === WSMessageTypes.CORRECT_ANSWER){
        Toast.show({
          type: 'success',
          text1: "Javob to'g'ri",
          text2: "Keyingi so'zni kuting",
          visibilityTime: 1000
        })
        setInputData('')
        setAnswered(true)
      }
      else if (data.type === WSMessageTypes.INCORRECT_ANSWER){
        Toast.show({
          type: 'error',
          text1: "Javob noto'g'ri",
          text2: "Keyingi so'zni kuting",
          visibilityTime: 1000
        })
        setInputData('')
        setAnswered(true)
      }
      else if (data.type === WSMessageTypes.ALREADY_ANSWERED){
        Toast.show({
          type: 'info',
          text1: "Allaqachon javob bergansiz",
          text2: "Keyingi so'zni kuting",
          visibilityTime: 500
        })
        setInputData('')
      }
      else if (data.type === WSMessageTypes.END_GAME){
        navigation.replace(
          'EndGame',
          {
            result: data.data.result,
            usersCount: users_count
          }
        )
      }
    };

    socketService.subscribe(onMessage);
    return () => socketService.unsubscribe(onMessage);
  }, []);

  useEffect(() => {
    console.log(`Answeredning qiymati : ${answered}`)
  }, [answered])
  
  const handleSendAnswer = async () => {
    if (inputData === ""){
      return Toast.show({
        type: 'error',
        text1: "Biror qiymat yozing",
        visibilityTime: 500
      })
    }
    if (answered){
      Toast.show({
          type: 'info',
          text1: "Allaqachon javob bergansiz",
          text2: "Keyingi so'zni kuting",
          visibilityTime: 500
        })
      setInputData('')
      return
    }
    socketService.send(
      {
        type: WSMessageTypes.SEND_ANSWER,
        data: {
          "answer": inputData,
          "game_username": game.owner
        }
      }
    )
  }

  useEffect(() => {
    const onBackPress = () => {
      Alert.alert('Chiqmoqchimisiz ?', 'Chiqsangiz bellashuvni tark etasiz !', [
        { text: 'Bekor qilish', style: 'cancel', onPress: () => {} },
        { text: 'Ha', onPress: () => navigation.replace('TabNavigator') },
      ]);
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex-1 mx-2'>
        {
          word.length !== 0 ? 
          <View className='flex-1'>
            <View className='flex items-center p-4'>
              <CountdownTimer
                key={index}
                duration={game.round_duration}
                onFinish={() => {}}
              />
            </View>
            <View className='flex justify-between flex-1 my-20'>
              <Text className='text-2xl text-center'>{index+1}. {word.join(', ')}</Text>
              <View>
                <Text className='text-center text-lg mb-8'>Yuqoridagi so'z{word.length > 1 && 'lar'}ning ingliz tilidagi tarjimasini yozing :</Text>
                <TextInput
                  className='border-2 border-blue-500 mx-4 rounded-xl text-xl'
                  keyboardType='ascii-capable'
                  onChangeText={setInputData}
                  value={inputData}
                />
              </View>
              <Button
                title='Yuborish'
                className='mx-8 py-4 rounded-lg'
                onPress={handleSendAnswer}
                disabled={answered}
              />
            </View>
          </View>
          :
          <View className='flex-1 justify-center items-center'>
            <Text className='text-3xl text-blue-400 font-bold'>O'yin boshlanmoqda !</Text>
            <Text className='text-xl mt-2 font-semibold'>O'yinchilar soni {users_count} ta</Text>
            <Text className='text-xl mt-2 font-semibold'>Savollar soni {game.words_len} ta</Text>
          </View>
        }
      </View>
    </SafeAreaView>
  )
}

export default GameScreen