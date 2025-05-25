import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '.';
import { TabBarIcon } from '../components/TabBarIcon';
import Home from 'screens/home/Home';
import Learn from 'screens/learn/Learn';
import Settings from 'screens/settings/Settings';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTokenExpiry } from 'utils/jwtUtils';
import Splash from 'components/Splash';
import { setAccessToken } from 'utils/calculations';
import { socketService } from 'app/services/socketService';

const Tab = createBottomTabNavigator();

type Props = StackScreenProps<RootStackParamList, 'TabNavigator'>;

export default function TabLayout({ navigation }: Props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const checkToken = async () => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          const untilTime = getTokenExpiry(token)
          if (untilTime && untilTime < new Date()) {
            setAccessToken(null)
            navigation.replace('Login');
          }else{
            socketService.connect(token);
          }
        }
        else{
          navigation.replace('Login');
        }
      };
      checkToken();
      setLoading(false);
  }, []);

  if (loading) return <Splash />;
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarStyle: {
        height: 64,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      tabBarIconStyle: {
        marginTop: 4,
        marginBottom: 4,
      },
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Bosh sahifa',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color}/>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Learn"
        component={Learn}
        options={{
          title: 'So\'z yodlash',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Sozlamalar',
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}

