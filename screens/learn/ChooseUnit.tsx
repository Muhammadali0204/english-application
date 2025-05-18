import { StackScreenProps } from '@react-navigation/stack';
import { RootState } from 'app/store';
import Unit from 'components/Unit';
import { RootStackParamList } from 'navigation';
import { View, Text, SafeAreaView, StatusBar, FlatList } from 'react-native'
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { UnitStatus } from 'types/dict';

type NavigationProps = StackScreenProps<RootStackParamList, 'ChooseUnit'>;


const ChooseUnit: React.FC<NavigationProps> = ({navigation, route}) => {
  const {unitsCount, bookId} = route.params
  const user = useSelector((state: RootState) => state.auth.user)

  const handleUnitPress = (index: number, status: UnitStatus) => {
    if (status === UnitStatus.disable && user) {
      if (index > user.completed_unit) {
        Toast.show({
          type: 'info',
          text1: 'Mumkin emas',
          text2: "Avvalgi unitlarni ko'rib chiqing"
        });
        return;
      }
    }
    navigation.navigate('SeeAllWords', {
      index,
      status,
      bookId
    });
  };


  return (
    <SafeAreaView className='flex-1 mx-2'>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View className='flex-1 mt-8 mx-4'>
        <Text className='text-3xl mb-4'>{bookId + 1} - kitob</Text>
        {unitsCount && <FlatList
          data={Array.from({ length: unitsCount })}
          renderItem={({ index }) => {
            let status: UnitStatus;
            const unitNumber = bookId * unitsCount + index + 1;
            const completedUnit = user?.completed_unit ?? 0;

            if (unitNumber <= completedUnit) {
              status = UnitStatus.enable;
            } else if (unitNumber === completedUnit + 1) {
              status = UnitStatus.current;
            } else {
              status = UnitStatus.disable;
            }

            return (
              <Unit
                index={index}
                onClick={handleUnitPress}
                status={status}
              />
            );
          }}
          keyExtractor={(_, index) => index.toString()}
        />}
      </View>
    </SafeAreaView>
  )
}

export default ChooseUnit
