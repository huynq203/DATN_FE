import { createContext, useState } from 'react'
import { Customer } from 'src/types/customer.type'
import { getAccessTokenFromLS, getProfileFromLS, getRoleFromLS } from 'src/utils/auth'

import { ExtendedCarts } from 'src/types/cart.type'
import { User } from 'src/types/user.type'
interface AppContextType {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: Customer | User | null
  setProfile: React.Dispatch<React.SetStateAction<Customer | User | null>>
  extendedCarts: ExtendedCarts[]
  setExtendedCarts: React.Dispatch<React.SetStateAction<ExtendedCarts[]>>
  role: string
  setRole: React.Dispatch<React.SetStateAction<string>>
  reset: () => void
}

const initialAppContext: AppContextType = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  extendedCarts: [],
  setExtendedCarts: () => null,
  role: getRoleFromLS(),
  setRole: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextType>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [extendedCarts, setExtendedCarts] = useState<ExtendedCarts[]>(initialAppContext.extendedCarts)
  const [profile, setProfile] = useState<Customer | User | null>(initialAppContext.profile)
  const [role, setRole] = useState<string>(initialAppContext.role)
  const reset = () => {
    setIsAuthenticated(false)
    setExtendedCarts([])
    setProfile(null)
    setRole('')
  }
  const value = {
    isAuthenticated,
    setIsAuthenticated,
    profile,
    setProfile,
    extendedCarts,
    setExtendedCarts,
    role,
    setRole,
    reset
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
