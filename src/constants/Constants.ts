const Constants = {
  Api: {
    BASE_URL: import.meta.env.VITE_URL_API,
    TIMEOUT: 15 * 1000
  },
  ApiPath: {
    //Auth
    CUSTOMER_LOGIN: '/customers/login',
    CUSTOMER_REGISTER: '/customers/register'
  }
}

export default Constants
