import ConversationFallBack from '@/components/shared/conversations/ConversationFallBack'
import ItemList from '@/components/shared/item-list/ItemList'
import { Button } from '@/components/ui/button'
import React from 'react'

type Props = {}

function MembersPage({}: Props) {
  return (
  <>
  <div><ItemList title="Members" action={undefined} >Member page</ItemList></div>
    <ConversationFallBack />
    </>
    
  )
}

export default MembersPage