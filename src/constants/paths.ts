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
    GET_ADDRESS: '/addresses',
    //Category
    CATEGORY_URL: '/categories',
    CREATE_CATEGORY: '/categories/create',
    UPDATE_CATEGORY: '/categories/update',
    DELETE_CATEGORY: '/categories/delete',
    //Product
    PRODUCT_URL: '/products',
    CREATE_PRODUCT: '/products/create',
    UPDATE_PRODUCT: '/products/update',
    DELETE_PRODUCT: '/products/delete',
    GET_PRODUCT_MANAGER: '/products/manager',
    UPLOAD_IMAGE: '/products/upload-image',
    PURCHASES_PRODUCT: '/products/create-purchases',
    GET_OPTION_PRODUCT: '/products/get-option-products',
    CREATE_OPTION_PRODUCT: '/products/create-option-product',
    UPDATE_OPTION_PRODUCT: '/products/update-option-product',
    DELETE_OPTION_PRODUCT: '/products/delete-option-product',
    EXPORT_FILE_PRODUCT: '/products/export-file',

    //Cart
    CART_URL: '/carts',
    CART_ADD_TO_CART: '/carts/add-to-cart',
    CART_BUY_PRODUCT: '/carts/buy-products',
    CART_UPDATE_PRODUCT: '/carts/update-product',
    ORDER_URL: '/orders',
    CREATE_ORDER_COD: '/orders/create-order-cod',
    CREATE_ORDER_MOMO: '/orders/create-order-momo',
    CREATE_ORDER_VNPAY: '/orders/create-order-vnpay',
    RETURN_VNPAY: '/orders/return-vnpay',

    GET_PROFILE: '/customers/profile',
    UPDATE_PROFILE: '/customers/profile',

    //Admin
    LOGIN_USER: '/users/login',
    LOGOUT_USER: '/users/logout',
    GET_ALL_CUSTOMERS: 'customers',
    DELETE_CUSTOMER: 'customers/delete'
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
    AUTH_VERIFY_EMAIL: '/auth/verify-email',
    HOME: '/', // Trang chủ
    PRODUCT: '/products', // Sản phẩm
    PRODUCT_DETAIL: '/products/:nameId', // Chi tiết sản phẩm
    BLOG: '/blog', // Blog
    INTRODUCE: '/introduce', // Giới thiệu
    CONTACT: '/contact', // Liên hệ
    CART: '/cart', // Giỏ hàng
    CHECKOUT: '/checkout', // Thanh toán
    CHECK_ORDER: '/check-order', // Đặt hàng thành công
    ORDER_DETAIL: '/order/:order_id', // Chi tiết đơn hàng
    CUSTOMER: '/customer', // Khách hàng
    PROFILE: '/customer/profile', // Hồ sơ cá nhân
    ADDRESS: '/customer/address', // Địa chỉ giao hàng
    CHANGE_PASSWORD: '/customer/change-password',
    HISTORY_ORDER: '/customer/history-order', // Đơn hàng
    WISH_LIST: '/customer/wish-list', // Danh sách yêu thích
    //Admin

    ADMIN_DASHBOARD: '/admin',
    ADMIN_MANAGER_CUSTOMER: '/admin/manager-customers',
    ADMIN_CUSTOMER_DETAIL: '/admin/manager-customers/:customer_id',
    ADMIN_MANAGER_USER: '/admin/manager-users',
    ADMIN_MANAGER_PRODUCT: '/admin/manager-products',
    ADMIN_CREATE_PRODUCT: '/admin/create-product',
    ADMIN_EDIT_PRODUCT: '/admin/update-product',
    ADMIN_UPDATE_PRODUCT: '/admin/update-product/:product_id',
    ADMIN_MANAGER_ORDER: '/admin/manager-orders',
    ADMIN_MANAGER_CATEGORY: '/admin/manager-categories',
    ADMIN_MANAGER_VOUCHER: '/admin/manager-vouchers',
    ADMIN_MANAGER_POST: '/admin/manager-posts',
    ADMIN_MANAGER_RECCEIPTES: '/admin/manager-receiptes',
    ADMIN_MANAGER_THEME: '/admin/manager-themes',
    //AUTH
    ADMIN_LOGIN: '/admin/login',
    ADMIN_LOGOUT: '/admin/logout',
    ADMIN_CHANGE_PASSWORD: '/admin/change-password'
  }
}

export default paths
