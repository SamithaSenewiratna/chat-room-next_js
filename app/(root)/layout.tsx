 import React, { Children } from 'react'
 
 type Props = React.PropsWithChildren<{}>
 
 const layout = ({ children }: Props) => {
   return (
     <>{children}</>
   )
 }
 
 export default layout