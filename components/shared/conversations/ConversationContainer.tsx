
import { Card } from '@/components/ui/card'
import React from 'react'

type Props = React.PropsWithChildren<{}>

const ConversationContainer = ({children}: Props) => {
  return (
   <Card className='h-[calc(100svh-32px)] w-full  p-2 flex flex-col gap-2'>
    {children}
   </Card>  
  )
}
export default ConversationContainer;