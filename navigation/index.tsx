import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './tab-navigator';
import Login from '../screens/auth/Login';
import Signup from 'screens/auth/Signup';
import ChooseUnit from 'screens/learn/ChooseUnit';
import SeeAllWords from 'screens/learn/SeeAllWords';
import { UnitStatus, WordsResponse } from 'types/dict';
import FindTranslation from 'screens/learn/FindTranslation';
import EndLearning from 'screens/learn/EndLearning';
import ShowFriends from 'screens/home/ShowFriends';
import ShowRequests from 'screens/home/ShowRequests';
import ChooseFriend from 'screens/competition/ChooseFriend';
import GameScreen from 'screens/competition/GameScreen';

export type RootStackParamList = {
  TabNavigator: undefined;
  Login: undefined;
  Signup: undefined;
  ChooseUnit: {unitsCount: number | undefined, bookId: number};
  SeeAllWords: {status: UnitStatus, index: number, bookId: number};
  FindTranslation: {data: WordsResponse | undefined};
  EndLearning: {
    correctsCount: number,
    incorrectsCount: number,
    book: number,
    unit: number,
    unitsInBook: number,
    wordsInUnit: number
  },
  ShowFriends: undefined,
  ShowRequests: undefined,
  ChooseFriend: undefined,
  GameScreen: undefined
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  return (
    <NavigationContainer
      // onStateChange={(state) => {
      //   const routes = state?.routes
      //   let screens: any = []
      //   routes?.map((value, index) => {
      //     screens.push(`${index} - ${value.name} ${value.state?.index}`)
      //   })
      //   console.log(`Screens :\n${screens.join('\n')}`)
      // }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_right' }}>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="ChooseUnit" component={ChooseUnit} />
          <Stack.Screen name="SeeAllWords" component={SeeAllWords} />
          <Stack.Screen name="FindTranslation" component={FindTranslation} />
          <Stack.Screen name="EndLearning" component={EndLearning} />
          <Stack.Screen name="ShowFriends" component={ShowFriends } />
          <Stack.Screen name="ShowRequests" component={ShowRequests} />
          <Stack.Screen name="ChooseFriend" component={ChooseFriend} />
          <Stack.Screen name="GameScreen" component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
