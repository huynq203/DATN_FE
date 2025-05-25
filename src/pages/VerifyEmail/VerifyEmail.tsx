import React from 'react'
import useQueryParams from 'src/hooks/useQueryParams'

export default function VerifyEmail() {
  const query = useQueryParams()
  const { token } = query
  console.log(token)

  return <div></div>
}
