import { cn } from "@/lib/utils";
import { SpinnerRoundFilled } from "spinners-react";

type Props = {
  state: boolean
  className?: string
  color?: string
  children?: React.ReactNode
}

const Loader = ({ state, className, color, children }: Props) => {
  return state ? (
    <div className={cn(className)}>
    <SpinnerRoundFilled size={ 50 } thickness = { 100} speed = { 100} color = { color } />
    </div>
  ): (
    children
  )
};

export default Loader;