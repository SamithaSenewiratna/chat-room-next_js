import React from 'react'

type Props = React.PropsWithChildren<{}>

const ConversationLayout = ({ children }: Props) => {
  return (
    <div>{children}</div>
  )
}

export default ConversationLayout