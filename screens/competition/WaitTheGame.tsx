import { View, Text, StatusBar, ScrollView, Alert, BackHandler, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from 'navigation';
import { AnimatedFriendItem } from 'components/AnimatedFriendItem';
import { SignalIcon, SignalSlashIcon } from 'react-native-heroicons/solid';
import { useSelector } from 'react-redux';
import { RootState } from 'app/store';
import { useStartGameMutation } from 'features/game/gameApi';
import { WebSocketMessage, WSMessageTypes } from 'types/ws';
import { socketService } from 'app/services/socketService';
import { UserStatus } from 'types/other';

type NavigationProps = StackScreenProps<RootStackParamList, 'WaitTheGame'>;

const WaitTheGame: React.FC<NavigationProps> = ({navigation, route}) => {
  const {usersStatus, game} = route.params
  const user = useSelector((state: RootState) => state.auth.user)
  const [startGameRequest] = useStartGameMutation()
  const [realUsersStatus, setRealUsersStatus] = useState<UserStatus[]>(usersStatus)

  useEffect(() => {
    const onMessage = async (data: WebSocketMessage) => {
      if (data.type === WSMessageTypes.GAME_STARTED){
        navigation.replace(
          'GameScreen',
          {
            users_count: data.data.users_count,
            game: game
          }
        )
      }
      else if (data.type === WSMessageTypes.JOIN_PLAYER){
        setRealUsersStatus(prev => {
        const alreadyExists = prev.some(u => u.user.id === data.data.user.id);
        if (!alreadyExists) {
          return [
            ...prev,
            {
              user: data.data.user,
              status: true
            }
          ];
        }
        return prev;
      });
      }
    };

    socketService.subscribe(onMessage);
    return () => socketService.unsubscribe(onMessage);
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      Alert.alert('Chiqmoqchimisiz ?', 'Chiqsangiz bellashuvni tark etasiz !', [
        { text: 'Bekor qilish', style: 'cancel', onPress: () => {} },
        { text: 'Ha', onPress: () => navigation.goBack() },
      ]);
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, []);

  const startGamaHandler = async () => {
    await startGameRequest()
  }

  return (
    <View className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView>
        <Text className='text-bold text-3xl mt-8'>Savollar soni {game.words_len} ta</Text>
        <Text className='text-semibold text-xl mt-4'>Har savol uchun berilgan vaqt: {game.round_duration} sekund</Text>
        <Text className='text-3xl text-center font-bold mt-8 mb-12'>O'yinchilar :</Text>
        {
          realUsersStatus.map((item, index) => {
            return (
              <View key={index} className='px-4 py-2 flex-row justify-between items-center bg-slate-200 rounded-lg mb-1'>
                <AnimatedFriendItem
                  friend={item.user}
                />
                {
                  item.status ?
                  <SignalIcon color={'green'} size={36}/>
                  :
                  <SignalSlashIcon color={'red'} size={36}/>
                }
              </View>
            )
          })
        }
        {
          game.owner === user?.username && 
          <View className="flex items-center mt-8 left-1/2 -translate-x-1/2">
            <Pressable
              className="rounded-lg bg-blue-500 justify-center items-center py-2 px-6"
              onPress={startGamaHandler}
            >
              <Text className="text-white text-lg">O'yinni boshlash</Text>
            </Pressable>
          </View>
        }
      </ScrollView>
    </View>
  )
}

export default WaitTheGame