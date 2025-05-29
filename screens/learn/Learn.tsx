import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootState } from 'app/store'
import Book from 'components/Book'
import { useGetDictionaryDataQuery } from 'features/dict/dictionaryApi'
import { RootStackParamList } from 'navigation'
import { useEffect } from 'react'
import { View, Text, StatusBar, ActivityIndicator } from 'react-native'
import Toast from 'react-native-toast-message'
import { useSelector } from 'react-redux'
import { calculatePercent } from 'utils/calculations'

type NavigationProp = StackNavigationProp<RootStackParamList>;

const Learn = () => {
  const {data, error, isLoading} = useGetDictionaryDataQuery()
  const user = useSelector((state: RootState) => state.auth.user)
  const navigation = useNavigation<NavigationProp>();

  const handleClick = (bookIndex: number, percent: number) => {
    if (!data || !user) return;

    const completedUnits = user.completed_unit;
    const unitsPerBook = data.units_in_one_book;
    const requiredUnits = bookIndex * unitsPerBook;

    if (completedUnits >= requiredUnits) {
      navigation.navigate('ChooseUnit', {
        unitsCount: unitsPerBook,
        bookId: bookIndex,
      });
    } else {
      Toast.show({
        type: 'info',
        text1: 'Mumkin emas',
        text2: "Avvalgi kitoblarni ko'rib chiqing"
      });
    }
  };

  useEffect(() => {
    if (error){
      Toast.show({
        type: 'error',
        text1: 'Xatolik',
        text2: "Ma'lumotlarni yuklab bo'lmadi !"
      })
    }
  }, [error])

  return (
    <View className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex-1 mt-8 mx-4'>
        <Text className='text-3xl mb-4'>Kitoblar :</Text>
        {
          isLoading ? 
            <View>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          :
            <View className='flex gap-4'>
              {data && Array.from({length: data.books_count}).map((_, index) => {
                const percent = calculatePercent(user?.completed_unit ?? 0, index, data.units_in_one_book)
                return <Book key={index}
                index={index}
                percent={percent}
                onClick={handleClick} />
            })}
            </View>
        }
      </View>
    </View>
  )
}

export default Learn
