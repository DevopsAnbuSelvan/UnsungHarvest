/**
 * Central API path constants.
 * Usage: EndPoints.productsList → "products_list_api"
 */
export class EndPoints {
  // Auth
  static readonly userLogin = "user_login_api";
  static readonly userRegister = "user_register_api";
  static readonly userMe = "user_me_api";
  static readonly userLogout = "user_logout_api";

  // Products
  static readonly productsList = "products_list_api";
  static readonly productsFeatured = "products_featured_api";
  static readonly productsTrending = "products_trending_api";
  static readonly productsRecent = "products_recent_api";
  static readonly productsSeasonal = "products_seasonal_api";
  static readonly productsGiTagged = "products_gi_tagged_api";
  static readonly productsGet = "products_get_api";
  static readonly productsCreate = "products_create_api";
  static readonly productsUpdate = "products_update_api";
  static readonly productsDelete = "products_delete_api";
  static readonly productsApprove = "products_approve_api";
  static readonly productsReject = "products_reject_api";

  // Season
  static readonly seasonList = "season_list_api";
  static readonly seasonGet = "season_get_api";
  static readonly seasonCreate = "season_create_api";
  static readonly seasonUpdate = "season_update_api";
  static readonly seasonDelete = "season_delete_api";

  // Uploads
  static readonly uploadsProductImages = "uploads_product_images_api";

  // Categories
  static readonly categoriesList = "categories_list_api";
  static readonly categoriesGet = "categories_get_api";
  static readonly categoriesCreate = "categories_create_api";
  static readonly categoriesUpdate = "categories_update_api";
  static readonly categoriesDelete = "categories_delete_api";

  // Nutrition
  static readonly nutritionList = "nutrition_list_api";
  static readonly nutritionGet = "nutrition_get_api";
  static readonly nutritionCreate = "nutrition_create_api";
  static readonly nutritionUpdate = "nutrition_update_api";
  static readonly nutritionDelete = "nutrition_delete_api";

  // Sellers
  static readonly sellersProfileGet = "sellers_profile_get_api";
  static readonly sellersProfileUpdate = "sellers_profile_update_api";
  static readonly sellersList = "sellers_list_api";
  static readonly sellersGet = "sellers_get_api";
  static readonly sellersCreate = "sellers_create_api";
  static readonly sellersUpdate = "sellers_update_api";
  static readonly sellersDelete = "sellers_delete_api";
  static readonly sellersApprove = "sellers_approve_api";
  static readonly sellersReject = "sellers_reject_api";

  // Farmers
  static readonly farmersList = "farmers_list_api";
  static readonly farmersGet = "farmers_get_api";
  static readonly farmersCreate = "farmers_create_api";
  static readonly farmersUpdate = "farmers_update_api";
  static readonly farmersDelete = "farmers_delete_api";

  // Locations
  static readonly locationsList = "locations_list_api";
  static readonly locationsGet = "locations_get_api";
  static readonly locationsCreate = "locations_create_api";
  static readonly locationsUpdate = "locations_update_api";
  static readonly locationsDelete = "locations_delete_api";

  // Cart
  static readonly cartGet = "cart_get_api";
  static readonly cartAdd = "cart_add_api";
  static readonly cartUpdate = "cart_update_api";
  static readonly cartRemove = "cart_remove_api";
  static readonly cartClear = "cart_clear_api";

  // Wishlist
  static readonly wishlistList = "wishlist_list_api";
  static readonly wishlistAdd = "wishlist_add_api";
  static readonly wishlistRemove = "wishlist_remove_api";

  // Orders
  static readonly ordersCreate = "orders_create_api";
  static readonly ordersMyOrders = "orders_my_orders_api";
  static readonly ordersList = "orders_list_api";
  static readonly ordersGet = "orders_get_api";
  static readonly ordersUpdateStatus = "orders_update_status_api";

  // Payments
  static readonly paymentsList = "payments_list_api";
  static readonly paymentsConfirm = "payments_confirm_api";

  // Notifications
  static readonly notificationsList = "notifications_list_api";
  static readonly notificationsMarkRead = "notifications_mark_read_api";
  static readonly notificationsMarkAllRead = "notifications_mark_all_read_api";

  // Buyers
  static readonly buyersProfileGet = "buyers_profile_get_api";
  static readonly buyersProfileUpdate = "buyers_profile_update_api";
  static readonly buyersAddressesCreate = "buyers_addresses_create_api";
  static readonly buyersAddressesList = "buyers_addresses_list_api";
  static readonly buyersList = "buyers_list_api";
  static readonly buyersGet = "buyers_get_api";
  static readonly buyersCreate = "buyers_create_api";
  static readonly buyersUpdate = "buyers_update_api";
  static readonly buyersDelete = "buyers_delete_api";

  // Admins (role=admin) — Super Cold Admin only
  static readonly adminsList = "admins_list_api";
  static readonly adminsGet = "admins_get_api";
  static readonly adminsCreate = "admins_create_api";
  static readonly adminsUpdate = "admins_update_api";
  static readonly adminsDelete = "admins_delete_api";

  // Dashboard / reports
  static readonly dashboardStats = "dashboard_stats_api";
  static readonly reportsSales = "reports_sales_api";
  static readonly usersList = "users_list_api";

  // Legacy dashboard aliases used by role UIs (same backend routes)
  static readonly buyerDashboard = "dashboard_stats_api";
  static readonly buyerProfile = "buyers_profile_get_api";
  static readonly buyerOrders = "orders_my_orders_api";
  static readonly sellerDashboard = "dashboard_stats_api";
  static readonly sellerInventory = "products_list_api";
  static readonly sellerOrders = "orders_my_orders_api";
  static readonly sellerAnalytics = "reports_sales_api";
  static readonly sellerCustomers = "users_list_api";
  static readonly sellerProfile = "sellers_profile_get_api";
  static readonly adminDashboard = "dashboard_stats_api";
  static readonly adminBuyers = "buyers_list_api";
  static readonly adminCategories = "categories_list_api";
  static readonly adminSeasonCalendar = "season_list_api";
  static readonly adminNutrition = "nutrition_list_api";
  static readonly adminGiTags = "products_gi_tagged_api";
  static readonly adminLocations = "locations_list_api";
  static readonly adminOrders = "orders_list_api";
  static readonly adminReports = "reports_sales_api";
  static readonly adminAdmins = "admins_list_api";
  static readonly adminPayments = "payments_list_api";
}
