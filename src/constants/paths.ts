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
    CHANGE_PASSWORD_CUSTOMER: '/customers/change-password',
    CUSTOMER_VERIFY_EMAIL: '/customers/verify-email',

    //
    //Category
    CATEGORY_URL: '/categories',
    CATEGORY_MANAGER_URL: '/categories/manager',
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
    UPLOAD_IMAGE_VARIANT_COLOR: '/products/upload-image-variant-color',
    PURCHASES_PRODUCT: '/products/create-purchases',
    GET_OPTION_PRODUCT: '/products/get-option-products',
    CHANGE_STATUS_PRODUCT: '/products/change-status',
    CHANGE_STATUS_OPTION_PRODUCT: '/products/change-status-option-product',
    CREATE_OPTION_PRODUCT: '/products/create-option-product',
    UPDATE_OPTION_PRODUCT: '/products/update-option-product',
    DELETE_OPTION_PRODUCT: '/products/delete-option-product',
    EXPORT_FILE_PRODUCT: '/products/export-file',
    CHECK_STOCK_OPTION_PRODUCT: '/products/check-stock-option-product',
    GET_PRODUCT_BY_DISCOUNT: '/products/get-product-by-discount',
    GET_PRODUCT_BY_MEN: '/products/get-product-by-men',
    GET_PRODUCT_BY_KID: '/products/get-product-by-kid',

    //Cart
    CART_URL: '/carts',
    CART_ADD_TO_CART: '/carts/add-to-cart',
    CART_BUY_PRODUCT: '/carts/buy-products',
    CART_UPDATE_PRODUCT: '/carts/update-product',

    //Order
    ORDER_URL: '/orders',
    CREATE_ORDER_COD: '/orders/create-order-cod',
    CREATE_ORDER_MOMO: '/orders/create-order-momo',
    RETURN_MOMO: '/orders/return-momo',
    CREATE_ORDER_VNPAY: '/orders/create-order-vnpay',
    RETURN_VNPAY: '/orders/return-vnpay',
    CANCEL_ORDER: '/orders/cancel-order',
    GET_ORDER_STATUS_COUNT: '/orders/get-order-status-count',
    GET_TOTAL_PROFIT_TO_MONTH: '/orders/get-total-profit-to-month',
    GET_TOTAL_PROFIT_TO_DAY_NOW: '/orders/get-total-profit-to-day-now',

    GET_ORDER_MANAGER: '/orders/get-order-manager',
    GET_ORDER_DETAIL: '/orders/get-order-detail',
    CHANGE_ORDER_STATUS: '/orders/change-order-status',
    EXPORT_FILE_ORDER: '/orders/export-file-order',
    GET_ORDER_BY_CUSTOMER: '/orders/get-order-by-customer',

    //Profile
    GET_PROFILE: '/customers/profile',
    UPDATE_PROFILE: '/customers/profile',

    //Address
    GET_ADDRESS: '/addresses',
    GET_ADDRESS_BY_CUSTOMER: '/addresses/address-by-customer',
    GET_ADDRESS_DETAIL: '/addresses/get-address-by-id',
    CREATE_ADDRESS: '/addresses/create',
    UPDATE_ADDRESS: '/addresses/update',
    DELETE_ADDRESS: '/addresses/delete',
    SET_DEFAULT_ADDRESS: '/addresses/set-default-address',

    //Admin
    LOGIN_USER: '/users/login',
    LOGOUT_USER: '/users/logout',
    GET_ALL_CUSTOMERS: '/customers',
    DELETE_CUSTOMER: 'customers/delete',
    CHANGE_STATUS_CUSTOMER: '/customers/change-status',
    EXPORT_FILE_CUSTOMER: '/customers/export-file',
    //USER
    GET_USERS: '/users',
    CHANGE_STATUS_USER: '/users/change-status',
    CREATE_USER: '/users/create',
    UPDATE_USER: '/users/update',
    DELETE_USER: '/users/delete',
    GET_USER_BY_ID: '/users/get-user-by-id',
    EXPORT_FILE_USER: '/users/export-file',
    CHANGE_PASSWORD_USER: '/users/change-password',
    //Voucher
    GET_VOUCHERS: '/vouchers',
    CREATE_VOUCHER: '/vouchers/create',
    UPDATE_VOUCHER: '/vouchers/update',
    DELETE_VOUCHER: '/vouchers/delete',
    GET_VOUCHER_BY_ID: '/vouchers/get-voucher-by-id',
    SAVE_VOUCHER: '/vouchers/save-voucher',

    //Role
    GET_ROLE_USER: '/roles',
    GET_ROLE_BY_ID: '/roles/get-role-by-id',
    CREATE_ROLE_USER: '/roles/create',
    UPDATE_ROLE_USER: '/roles/update',
    DELETE_ROLE_USER: '/roles/delete',

    // Purchase Order
    CREATE_PURCHASE_ORDER: '/purchase-orders/create',
    DELETE_PURCHASE_ORDER: '/purchase-orders/delete',
    SET_IS_PUSH_INVENTORY: '/purchase-orders/push-inventory',

    //Schedule Product
    // SCHEDULE_PRODUCT: '/schedule-products',
    CREATE_SCHEDULE_PRODUCT: '/schedule-products/create',
    UPDATE_SCHEDULE_PRODUCT: '/schedule-products/update',
    DELETE_SCHEDULE_PRODUCT: '/schedule-products/delete',
    GET_ALL_SCHEDULE_PRODUCT: '/schedule-products',
    GET_SCHEDULE_PRODUCT_BY_ID: '/schedule-products/get-schedule-product-by-id',

    // Rating
    CREATE_RATING: '/ratings/create',
    GET_RATING_BY_PRODUCT: '/ratings/get-rating-by-product',

    //Wish list
    GET_WISH_LIST_BY_PRODUCT: '/wishlists/get-wishlist-by-product',
    GET_WISH_LIST_BY_CUSTOMER: '/wishlists/get-wishlist-by-customer',
    CHANE_WISH_LIST_FAVORITE: '/wishlists/change-wishlist-favorite',
    DELETE_WISH_LIST_BY_CUSTOMER: '/wishlists/delete-wishlist-by-customer',

    //Image sliders
    UPLOAD_IMAGE_SLIDER: '/image-sliders/upload-image-slider',
    GET_ALL_IMAGE_SLIDER: '/image-sliders',
    CREATE_IMAGE_SLIDER: '/image-sliders/create',
    DELETE_IMAGE_SLIDER: '/image-sliders/delete'
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
    VOUCHER: '/voucher', // Blog
    MEN: '/men',
    WOMEN: '/women',
    KIDS: '/kids',
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
    ADMIN_PROFILE: '/admin/profile',
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
    ADMIN_MANAGER_SCHEDULE_PRODUCT: '/admin/manager-schedule-products',
    ADMIN_MANAGER_POST: '/admin/manager-posts',
    ADMIN_MANAGER_RECCEIPTES: '/admin/manager-receiptes',
    ADMIN_MANAGER_ROLE: '/admin/manager-roles',
    ADMIN_MANAGER_THEME: '/admin/manager-themes',
    ADMIN_MANAGER_IMAGE_SLIDER: '/admin/manager-image-sliders',
    //AUTH
    ADMIN_LOGIN: '/admin/login',
    ADMIN_LOGOUT: '/admin/logout',
    ADMIN_CHANGE_PASSWORD: '/admin/change-password'
  }
}

export default paths
