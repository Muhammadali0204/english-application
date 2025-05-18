import AsyncStorage from "@react-native-async-storage/async-storage";

export const calculatePercent = (completedUnits: number, bookIndex: number, unitsPerBook: number): number => {
  const unitsCompletedInThisBook = completedUnits - bookIndex * unitsPerBook;
  const percent = (unitsCompletedInThisBook / unitsPerBook) * 100;
  return Math.max(0, Math.min(percent, 100));
};

export const setAccessToken = async (token: string | null) => {
  if (token){
    await AsyncStorage.setItem('accessToken', token)
  }else{
    await AsyncStorage.removeItem('accessToken')
  }
}
