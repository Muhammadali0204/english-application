import { StackScreenProps } from '@react-navigation/stack';
import { Button } from 'components/Button';
import { useGetDictionaryDataQuery } from 'features/dict/dictionaryApi';
import { RootStackParamList } from 'navigation';
import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, TextInput } from 'react-native'
import Toast from 'react-native-toast-message';
import { CheckIcon, XMarkIcon } from 'react-native-heroicons/solid';


type NavigationProps = StackScreenProps<RootStackParamList, 'FindTranslation'>;

const FindTranslation: React.FC<NavigationProps> = ({ navigation, route }) => {
  const { data } = route.params
  const [index, setIndex] = useState(0)
  const {data: dictData} = useGetDictionaryDataQuery()
  const [inputData, setInputData] = useState('')
  const [correctWordsCount, setCorrectWordsCount] = useState(0)
  const [incorrectWordsCount, setInorrectWordsCount] = useState(0)

  const handleKnow = () => {
    if (data){
      if (inputData === ''){
        Toast.show({
          type: 'info',
          text1: "Biror qiymat kiriting !"
        })
        return
      }
      let status: boolean
      if (data.words[index].data.en.includes(inputData.trim().toLowerCase())){
        setCorrectWordsCount(correctWordsCount + 1)
        status = true
      }else{
        setInorrectWordsCount(incorrectWordsCount + 1)
        status = false
      }
      Toast.show({
        type: status ? 'success' : 'error',
        text1: status ? "To'g'ri" : "Noto'g'ri",
        text2: `- ${data.words[index].data.en.join(', ')}`,
      })
      setIndex(index + 1)
      setInputData('')
    }
  }

  const handleDontKnow = () => {
    if (data){
      Toast.show({
        type: 'info',
        text1: `- ${data.words[index].data.en.join(', ')}`,
        visibilityTime: 1500
      })
      setInorrectWordsCount(incorrectWordsCount + 1)
      setIndex(index + 1)
      setInputData('')
    }
  }

  useEffect(() => {
    if (dictData && index === dictData.words_in_one_unit){
      navigation.replace('EndLearning',
        {
          correctsCount: correctWordsCount,
          incorrectsCount: incorrectWordsCount,
          book: data?.book ?? 1,
          unit: data?.unit ?? 1,
          wordsInUnit: dictData.words_in_one_unit,
          unitsInBook: dictData.units_in_one_book
        }
      )
    }
  }, [incorrectWordsCount, correctWordsCount])

  return (
    <View className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {
        data && index < data.words.length &&
        <View className='flex-1'>
          <View className='flex-row justify-between p-4'>
            <View className='border-2 border-indigo-500 p-4 flex flex-row justify-center rounded-lg gap-2'>
              <CheckIcon size={24} color={'green'} />
              <Text className='text-lg'>{correctWordsCount}</Text>
            </View>
            <View className='border-2 border-indigo-500 p-4 flex flex-row justify-center rounded-lg gap-2'>
              <XMarkIcon size={24} color={'red'} />
              <Text className='text-lg'>{incorrectWordsCount}</Text>
            </View>
          </View>
          <View className='flex justify-between flex-1 my-20'>
            <Text className='text-2xl text-center'>{data.words[index].data.uz.join(', ')}</Text>
            <View>
              <Text className='text-center text-lg mb-8'>Yuqoridagi so'z{data.words[index].data.uz.length > 1 && 'lar'}ning ingliz tilidagi tarjimasini yozing :</Text>
              <TextInput
                className='border-2 border-blue-500 mx-4 rounded-xl text-xl'
                keyboardType='ascii-capable'
                onChangeText={setInputData}
                value={inputData}
              />
            </View>
            <View className='flex gap-2'>
              <Button
                title='Bilmadim'
                className='py-4 rounded-lg bg-red-500 self-center'
                onPress={handleDontKnow}
              />
              <Button
                title='Tekshirish'
                className='mx-8 py-4 rounded-lg'
                onPress={handleKnow}
              />
            </View>
          </View>
        </View>
      }
    </View>
  )
}

export default FindTranslation