import { Role } from "../config/constants";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Logout from "../components/auth/Logout";
import ManageRestaurants from "../components/restaurant/ManageRestaurants";
import Restaurants from "../components/restaurant/Restaurants";
import Restaurant from "../components/restaurant/Restaurant";
import RestaurantAdd from "../components/restaurant/RestaurantAdd";
import RestaurantEdit from "../components/restaurant/RestaurantEdit";
import PendingReviews from "../components/review/PendingReviews";
import ManageUsers from "../components/user/ManageUsers";
import UserEdit from "../components/user/UserEdit";
import Account from "../components/auth/Account";

const routes = [
  {
    path: "/login",
    component: Login,
    isPrivate: false,
  },
  {
    path: "/register",
    component: Register,
    isPrivate: false,
  },

  {
    path: "/logout",
    component: Logout,
    isPrivate: false,
  },

  {
    path: "/users/:userId/edit",
    roles: [Role.Admin],
    component: UserEdit,
    isPrivate: true,
  },

  {
    path: "/users",
    roles: [Role.Admin],
    component: ManageUsers,
    isPrivate: true,
  },

  
  {
    path: "/restaurants/new",
    roles: [Role.Owner],
    component: RestaurantAdd,
    isPrivate: false,
  },

  {
    path: "/restaurants/:restaurantId/edit",
    roles: [Role.Admin, Role.Owner],
    component: RestaurantEdit,
    isPrivate: false,
  },



  {
    path: "/restaurants/:restaurantId",
    component: Restaurant,
    isPrivate: true,
  },


  {
    path: "/restaurants",
    components: {
      [Role.Admin]: ManageRestaurants,
      [Role.Owner]: ManageRestaurants,
      [Role.Regular]: Restaurants,
    },
    isPrivate: true,
  },

  
  {
    path: "/pending-reviews",
    roles: [Role.Owner],
    component: PendingReviews,
    isPrivate: true,
  },

  {
    path: "/profile",
    component: Account,
    isPrivate: true,
  },

  {
    path: "/",
    components: {
      [Role.Admin]: ManageRestaurants,
      [Role.Owner]: PendingReviews,
      [Role.Regular]: Restaurants
    },
    isPrivate: true,
  },

];

export default routes;
