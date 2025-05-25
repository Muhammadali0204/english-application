import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useGetMeQuery, useLazyGetMeQuery } from 'features/auth/authApi'
import { clearUser, setUser } from 'features/auth/authSlice'
import { RootStackParamList } from 'navigation'
import { useEffect } from 'react'
import { View, Text, SafeAreaView, StatusBar, Pressable } from 'react-native'
import Toast from 'react-native-toast-message'
import { useDispatch } from 'react-redux'
import { setAccessToken } from 'utils/calculations'
import Splash from 'components/Splash'
import { socketService } from 'app/services/socketService'
import { WebSocketMessage, WSMessageTypes } from 'types/ws'

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Home = () => {
  const { data, error, isSuccess, isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [triggerGetMe] = useLazyGetMeQuery();
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  const resetUser = async () => {
    try {
      const user = await triggerGetMe().unwrap();
      dispatch(setUser(user));
    } catch (e) {
      console.error("GetMe error from WS:", e);
    }
  }

  // 🔁 WebSocket orqali yangilanish
  useEffect(() => {
    const onMessage = async (data: WebSocketMessage) => {
      if (data.type === WSMessageTypes.RECEIVE_FRIENDSHIP_REQUEST) {
        Toast.show({
          type: 'info',
          text1: "Do'stlik taklifi",
          text2: "Sizda yangi do'stlik taklifi bor !"
        });
        await resetUser()
      }
      else if (data.type === WSMessageTypes.USER_CANCEL_REQUEST){
        await resetUser()
      }
      else if (data.type === WSMessageTypes.ACCEPT_REQUEST){
        data.data
        Toast.show({
          type: 'success',
          text1: "Qabul qilindi",
          text2: `${data.data?.user.name} so'rovingizni qabul qildi`
        });
      }
      else if (data.type === WSMessageTypes.REJECT_REQUEST){
        Toast.show({
          type: 'error',
          text1: "Rad etildi",
          text2: `${data.data?.user.name} so'rovingizni rad etdi`
        });
      }
    };

    socketService.subscribe(onMessage);
    return () => socketService.unsubscribe(onMessage);
  }, []);

  // ❌ Auth xato bo‘lsa logout
  useEffect(() => {
    if (error && 'status' in error && error.status === 401) {
      Toast.show({
        type: 'error',
        text1: 'Sessiya tugadi',
        text2: 'Iltimos qayta kiring',
      });
      dispatch(clearUser());
      setAccessToken(null);
      navigation.replace('Login');
    } else if (error) {
      Toast.show({
        type: 'error',
        text1: 'Xatolik',
        text2: 'Server bilan bog‘lanishda xatolik',
      });
    }
  }, [error]);

  // ✅ Ma’lumot muvaffaqiyatli kelganda set qilish
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
    }
  }, [isSuccess, data]);

  const handleMyFriends = () => navigation.navigate('ShowFriends');
  const handleInvites = () => navigation.navigate('ShowRequests')
  const handleCompetition = () => navigation.navigate('ChooseFriend')

  if (isLoading) return <Splash />;

  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex-1 mx-4'>
        <Text className={styles.hello_text}>Salom, {data?.name || 'Foydalanuvchi'}</Text>
        <View className='flex-row justify-between mt-12'>
          <Pressable className={styles.friends_card} onPress={handleMyFriends}>
            <Text className='text-3xl font-bold'>Do'stlaringiz</Text>
          </Pressable>
          <Pressable className={styles.invites_card} onPress={handleInvites}>
            <Text className='text-3xl font-bold'>Takliflar</Text>
            <View className={styles.invites_notification}>
              <Text className='text-2xl'>
                {data?.requests_count ?? 0}
              </Text>
            </View>
          </Pressable>
        </View>
        <Pressable onPress={handleCompetition} className={styles.competition_card}>
          <Text className='text-3xl font-bold'>Bellashuv boshlash</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = {
  hello_text: 'mt-4 p-4 bg-slate-50 border border-l-indigo-300 rounded-lg text-2xl font-bold',
  friends_card: "bg-amber-300 rounded-xl flex items-center justify-center w-[48%] h-48",
  invites_card: "bg-blue-300 rounded-xl flex items-center justify-center relative w-[48%] h-48",
  invites_notification: 'absolute -top-3 -right-3 bg-red-500 w-12 h-12 flex rounded-full items-center justify-center',
  competition_card: "bg-indigo-500 rounded-xl flex items-center justify-center h-36 mt-6",
};
