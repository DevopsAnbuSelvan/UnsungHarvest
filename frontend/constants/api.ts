import { EndPoints } from "@/constants/end_points";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export const UPLOAD_BASE_URL =
  process.env.NEXT_PUBLIC_UPLOAD_URL ||
  API_BASE_URL.replace(/\/api\/v\d+\/?$/, "");

/** Nested shape kept for existing services; paths are defined in EndPoints. */
export const API_ENDPOINTS = {
  auth: {
    login: EndPoints.userLogin,
    register: EndPoints.userRegister,
    me: EndPoints.userMe,
    logout: EndPoints.userLogout,
  },
  products: {
    list: EndPoints.productsList,
    featured: EndPoints.productsFeatured,
    trending: EndPoints.productsTrending,
    recent: EndPoints.productsRecent,
    seasonal: EndPoints.productsSeasonal,
    giTagged: EndPoints.productsGiTagged,
    get: EndPoints.productsGet,
    search: EndPoints.productsList,
    create: EndPoints.productsCreate,
    update: EndPoints.productsUpdate,
    delete: EndPoints.productsDelete,
    approve: EndPoints.productsApprove,
    reject: EndPoints.productsReject,
  },
  season: {
    list: EndPoints.seasonList,
    get: EndPoints.seasonGet,
  },
  uploads: {
    productImages: EndPoints.uploadsProductImages,
  },
  categories: {
    list: EndPoints.categoriesList,
    get: EndPoints.categoriesGet,
  },
  nutrition: {
    list: EndPoints.nutritionList,
    get: EndPoints.nutritionGet,
  },
  sellers: {
    profileGet: EndPoints.sellersProfileGet,
    profileUpdate: EndPoints.sellersProfileUpdate,
    list: EndPoints.sellersList,
    approve: EndPoints.sellersApprove,
    reject: EndPoints.sellersReject,
  },
  locations: EndPoints.locationsList,
  cart: EndPoints.cartGet,
  wishlist: EndPoints.wishlistList,
  orders: EndPoints.ordersList,
  notifications: EndPoints.notificationsList,
  buyer: {
    dashboard: EndPoints.buyerDashboard,
    profile: EndPoints.buyerProfile,
    orders: EndPoints.buyerOrders,
  },
  seller: {
    dashboard: EndPoints.sellerDashboard,
    inventory: EndPoints.sellerInventory,
    orders: EndPoints.sellerOrders,
    analytics: EndPoints.sellerAnalytics,
    customers: EndPoints.sellerCustomers,
    profile: EndPoints.sellerProfile,
  },
  admin: {
    dashboard: EndPoints.adminDashboard,
    buyers: EndPoints.adminBuyers,
    categories: EndPoints.adminCategories,
    seasonCalendar: EndPoints.adminSeasonCalendar,
    nutrition: EndPoints.adminNutrition,
    giTags: EndPoints.adminGiTags,
    locations: EndPoints.adminLocations,
    orders: EndPoints.adminOrders,
    reports: EndPoints.adminReports,
  },
} as const;

export { EndPoints };
