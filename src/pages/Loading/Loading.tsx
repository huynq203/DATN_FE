import { CSSProperties } from 'react'
import { BeatLoader } from 'react-spinners'

interface Props {
  loading: boolean
  color: string
  top: string
}
export default function Loading({ loading, color, top }: Props) {
  const override: CSSProperties = {
    display: 'block',
    margin: '0 auto',
    textAlign: 'center',
    position: 'absolute',
    top: top,
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
  return <BeatLoader cssOverride={override} loading={loading} margin={2} size={25} color={color} />
}
