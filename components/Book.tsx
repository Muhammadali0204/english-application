import { Pressable, View, Text } from 'react-native'

type Props = {
  index: number
  percent: number
  onClick: (index: number, percent: number) => void
}

const Book: React.FC<Props> = ({percent, onClick, index}) => {
  return (
    <Pressable onPress={() => onClick(index, percent)}>
      <View className="w-full bg-slate-400 rounded-2xl h-16 relative overflow-hidden">
        <View className="bg-blue-600 h-16 rounded-2xl" style={{ width: `${percent}%` }} />
        <View className="absolute inset-0 flex items-center justify-center">
          <Text className="text-white font-bold text-3xl">KITOB {index + 1}</Text>
        </View>
      </View>
    </Pressable>
  )
}

export default Book