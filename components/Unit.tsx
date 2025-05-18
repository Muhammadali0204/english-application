import { Pressable, View, Text } from 'react-native'
import { UnitStatus } from 'types/dict'

type Props = {
  index: number
  onClick: (index: number, status: UnitStatus) => void
  status: UnitStatus,
}

const Unit: React.FC<Props> = ({onClick, index, status}) => {
  return (
    <Pressable onPress={() => onClick(index, status)}>
      <View
        className={`
          ${status === UnitStatus.enable ? 'bg-blue-600'
            : status === UnitStatus.current ? 'bg-yellow-500'
            : 'bg-slate-400'}
          rounded-2xl my-2 p-2 py-4
        `}
      >
        <Text className='text-xl text-center text-white'>UNIT {index + 1}</Text>
      </View>
    </Pressable>
  )
}

export default Unit