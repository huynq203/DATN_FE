const paths = {
  Api: {
    BASE_URL: import.meta.env.VITE_URL_API,
    TIMEOUT: 10 * 1000
  },
  ApiPath: {
    //Auth
    CUSTOMER_LOGIN: '/customers/login',
    CUSTOMER_REGISTER: '/customers/register',
    CUSTOMER_LOGOUT: '/customers/logout',
    CUSTOMER_GOOGLE_LOGIN: '/customers/auth/google',
    CUSTOMER_FORGOT_PASSWORD: '/customers/forgot-password',
    CUSTOMER_VERIFY_FORGOT_PASSWORD: '/customers/verify-forgot-password',
    CUSTOMER_RESET_PASSWORD: '/customers/reset-password',
    //Category
    CATEGORY_URL: '/categories',
    //Product
    PRODUCT_URL: '/products',
    //Cart
    CART_URL: '/carts',
    CART_ADD_TO_CART: '/carts/add-to-cart',
    CART_BUY_PRODUCT: '/carts/buy-products',
    CART_UPDATE_PRODUCT: '/carts/update-product',
    ORDER_URL: '/orders',
    CREATE_ORDER_COD: '/orders/create-order-cod',
    CREATE_ORDER_MOMO: '/orders/create-order-momo',
    CREATE_ORDER_VNPAY: '/orders/create-order-vnpay',
    RETURN_VNPAY: '/orders/return-vnpay'
  },
  Screens: {
    //Site
    AUTH_LOGIN: '/auth/login',
    AUTH_OAUTH: '/auth/oauth',
    AUTH_REGISTER: '/auth/register',
    AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
    AUTH_VERIFY_FORGOT_PASSWORD: '/auth/verify-forgot-password',
    AUTH_RESET_PASSWORD: '/auth/reset-password',
    AUTH_LOGOUT: '/auth/logout',
    HOME: '/', // Trang chủ
    PRODUCT: '/products', // Sản phẩm
    PRODUCT_DETAIL: '/products/:nameId', // Chi tiết sản phẩm
    BLOG: '/blog', // Blog
    INTRODUCE: '/introduce', // Giới thiệu
    CONTACT: '/contact', // Liên hệ
    PROFILE: '/profile', // Hồ sơ cá nhân
    CART: '/cart', // Giỏ hàng
    CHECKOUT: '/checkout', // Thanh toán
    MY_ORDER: '/my-order', // Đơn hàng
    ORDER_DETAIL: '/order/:id', // Chi tiết đơn hàng
    CHANGE_PASSWORD: '/change-password',
    CHECK_ORDER: '/check-order', // Đặt hàng thành công
    //Admin
    ADMIN_DASHBOARD: '/admin',
    ADMIN_MANAGER_CUSTOMER: '/admin/customers',
    ADMIN_MANAGER_USER: '/admin/users',
    ADMIN_MANAGER_PRODUCT: '/admin/products',
    ADMIN_MANAGER_ORDER: '/admin/orders',
    ADMIN_MANAGER_CATEGORY: '/admin/categories',
    ADMIN_MANAGER_VOUCHER: '/admin/vouchers',
    ADMIN_MANAGER_POST: '/admin/posts',
    ADMIN_MANAGER_RECCEIPTES: '/admin/receiptes',
    ADMIN_MANAGER_THEME: '/admin/themes',
    ADMIN_LOGIN: '/admin/login',
    ADMIN_CHANGE_PASSWORD: '/admin/change-password'
  }
}

export default paths
