
import { Card } from '@/components/ui/card'
import React from 'react'


const ConversationFallBack = () => {
  return (
   <Card className='hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground'>
    Select/start a new conversation to get started!
   </Card>  
  )
}

export default ConversationFallBack;