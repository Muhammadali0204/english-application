import { StackScreenProps } from '@react-navigation/stack';
import { Button } from 'components/Button';
import { useGetWordsQuery } from 'features/dict/dictionaryApi';
import { RootStackParamList } from 'navigation';
import { View, Text, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';

type NavigationProps = StackScreenProps<RootStackParamList, 'SeeAllWords'>;

const SeeAllWords: React.FC<NavigationProps> = ({ navigation, route }) => {
  const { index, bookId } = route.params;
  const { data, isLoading } = useGetWordsQuery({ book: bookId + 1, unit: index + 1 },{
    refetchOnMountOrArgChange: true,
  }
  );

  const nextScreen = () => {
    navigation.replace('FindTranslation',
      {
        data
      }
    )
  }

  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {isLoading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={data?.words}
          className='mt-8 mx-4 pr-2'
          contentContainerStyle={{ paddingBottom: 80 }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View className='flex flex-row justify-between mb-2 gap-1'>
              <Text className='text-lg'>{index + 1}. <Text className='text-indigo-500'>{item.data.en.join(', ')}</Text></Text>
              <Text className='text-lg'>-</Text>
              <Text className='text-lg text-violet-400'>{item.data.uz.join(', ')}</Text>
            </View>
          )}
          ListHeaderComponent={
            <View className='mb-4'>
              <Text className='text-2xl font-bold mb-2'>So'zlarni yaxshilab yodlab oling !</Text>
              <Text className='text-xl font-semibold'>Keyin esa ushbu so'zlar bilan mashqlar bajaramiz</Text>
            </View>
          }
          ListFooterComponent={
            <View className='flex items-end mt-8'>
              <Button
                title='Davom etish'
                className='px-4 py-2 rounded-lg'
                onPress={nextScreen}
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SeeAllWords;
