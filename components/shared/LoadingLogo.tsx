import Image  from "next/image"

type Props = {
    size?: number;

}

function LoadingLogo({size=100}: Props) {
  return (
    <div className="h-full w-full flex justify-center items-center">
        <Image 
          src="/logo.svg" 
          alt="logo" 
          width={size} 
          height={size} 
          className="animate-pulse duration-700 "
          />
        </div>
  )
}

export default LoadingLogo;