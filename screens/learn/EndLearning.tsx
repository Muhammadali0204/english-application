import { StackScreenProps } from '@react-navigation/stack';
import { RootState } from 'app/store';
import { Button } from 'components/Button';
import { useLazyGetMeQuery } from 'features/auth/authApi';
import { setUser } from 'features/auth/authSlice';
import { useCompleteUnitMutation } from 'features/dict/dictionaryApi';
import { RootStackParamList } from 'navigation';
import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StatusBar } from 'react-native'
import { CheckIcon, XMarkIcon } from 'react-native-heroicons/solid';
import { useDispatch, useSelector } from 'react-redux';

type NavigationProps = StackScreenProps<RootStackParamList, 'EndLearning'>;

const EndLearning: React.FC<NavigationProps> = ({navigation, route}) => {
  const user = useSelector((state: RootState) => (state.auth.user));
  const [userCompletedUnit, setUserCompletedUnit] = useState(user?.completed_unit)
  const [completeUnit] = useCompleteUnitMutation();
  const [triggerGetMe] = useLazyGetMeQuery();
  const dispatch = useDispatch()

  const {
    correctsCount,
    incorrectsCount,
    book,
    unit,
    wordsInUnit,
    unitsInBook
  } = route.params

  useEffect(() => {
    const func = async () => {
      const unitIndex = (book - 1) * unitsInBook + unit;
      if (
        correctsCount === wordsInUnit &&
        user?.completed_unit === unitIndex - 1
      ) {
        await completeUnit({ book, unit });
        await triggerGetMe().unwrap()
        .then(
          (user) => {
            dispatch(setUser(user))
          }
        )
      }
    }
    func()
  }, []);

  const getText = (correctsCount: number) => {
    if (correctsCount / wordsInUnit < 0.5){
      return "So'zlarni yodlashda davom eting, natijangiz albatta yaxshi bo'ladi 🙂"
    }
    else if (correctsCount / wordsInUnit < 0.9){
      return "Natijangiz yaxshi, so'zlarni yod olishda davom eting 🙂"
    }
    else if (correctsCount === wordsInUnit){
      return "Qoyil, barcha so'zlarni topdingiz ⭐️"
    }
  }

  const isEnded = () => {
    const unitIndex = (book - 1) * unitsInBook + unit;
    if (userCompletedUnit === unitIndex - 1) {
      if (correctsCount === wordsInUnit){
        return 1
      }else{
        return 3
      }
    }
    else{
      return 2
    }
  }


  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex gap-4 mt-12'>
        <View className={styles.rectangle}>
          <CheckIcon size={36} color={'green'} />
          <Text className='text-2xl'>{correctsCount}</Text>
        </View>
        <View className={styles.rectangle}>
          <XMarkIcon size={36} color={'red'} />
          <Text className='text-2xl'>{incorrectsCount}</Text>
        </View>
      </View>
      <Text className='mt-24 px-4 py-2 text-center text-xl'>{getText(correctsCount)}</Text>
      {
        isEnded() === 1 ?
        <Text className='mt-24 px-4 py-2 text-2xl text-blue-500 text-center'>
          Tabriklaymiz, ushbu unitni yakunladingiz 🎉
        </Text>
        :
        isEnded() === 2 ? 
        <Text className='mt-24 px-4 py-2 text-2xl text-blue-500 text-center'>
          Ushbu unitni yakunlagansiz !
        </Text>
        :
        <Text className='mt-24 px-4 py-2 text-2xl text-gray-500 text-center'>
          Ushbu unitni yakunlashingiz uchun barcha savollarga to'g'ri javob berishingiz kerak !
        </Text>
      }
      <View className='flex items-center mt-12'>
        <Button
          title='Ortga'
          className='px-8 py-4 rounded-lg bg-blue-500'
          onPress={() => {navigation.goBack()}}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = {
  rectangle: 'border-2 border-indigo-500 p-8 flex flex-row justify-center items-center rounded-lg gap-2'
}

export default EndLearning