const Constants = {
  Api: {
    BASE_URL: import.meta.env.VITE_URL_API,
    TIMEOUT: 10 * 1000
  },
  ApiPath: {
    //Auth
    CUSTOMER_LOGIN: '/customers/login',
    CUSTOMER_REGISTER: '/customers/register',
    CUSTOMER_LOGOUT: '/customers/logout'
  },
  Screens: {
    AUTH_LOGIN: '/auth/login',
    AUTH_OAUTH: '/auth/oauth',
    AUTH_REGISTER: '/auth/register',
    AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
    AUTH_LOGOUT: '/auth/logout',
    HOME: '/',
    PROFILE: '/profile',
    CART: '/cart',
    CHANGE_PASSWORD: '/change-password',
    ADMIN_DASHBOARD: '/admin'
  }
}

export default Constants
