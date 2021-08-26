import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import { LOGGED_IN_USER } from "./actionTypes/userActionTypes";
import { currentUser } from "./services/authService";
import { LoadingOutlined } from "@ant-design/icons";

const Header = lazy(() => import("./components/nav/Header"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));
const Home = lazy(() => import("./pages/Home"));

const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const History = lazy(() => import("./pages/user/History"));
const UserRoute = lazy(() => import("./components/routes/UserRoute"));
const AdminRoute = lazy(() => import("./components/routes/AdminRoute"));
const Password = lazy(() => import("./pages/user/Password"));
const Wishlist = lazy(() => import("./pages/user/Wishlist"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const CategoryCreate = lazy(() =>
  import("./pages/admin/category/CategoryCreate")
);
const CategoryUpdate = lazy(() =>
  import("./pages/admin/category/CategoryUpdate")
);
const SubCategoryCreate = lazy(() =>
  import("./pages/admin/subCategory/SubCategoryCreate")
);
const SubCategoryUpdate = lazy(() =>
  import("./pages/admin/subCategory/SubCategoryUpdate")
);
const ProductCreate = lazy(() => import("./pages/admin/product/ProductCreate"));
const AllProducts = lazy(() => import("./pages/admin/product/AllProducts"));
const ProductUpdate = lazy(() => import("./pages/admin/product/ProductUpdate"));
const Product = lazy(() => import("./pages/Product"));
const CategoryHome = lazy(() => import("./pages/category/CategoryHome"));
const SubCategoryHome = lazy(() =>
  import("./pages/subcategory/SubCategoryHome")
);
const Shop = lazy(() => import("./pages/Shop"));
const Cart = lazy(() => import("./pages/Cart"));
const SideDrawer = lazy(() => import("./components/modals/SideDrawer"));
const Checkout = lazy(() => import("./pages/Checkout"));
const CreateCouponPage = lazy(() =>
  import("./pages/admin/coupon/CreateCouponPage")
);
const Payment = lazy(() => import("./pages/Payment"));

const App = () => {
  const dispatch = useDispatch();

  //to check firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();

        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: LOGGED_IN_USER,
              payload: {
                email: res.data.email,
                token: idTokenResult.token,
                name: res.data.name,
                role: res.data.role,
                _id: res.data._id,
              },
            });
          })
          .catch((e) => console.log(e));
      }
    });

    //cleanup
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div className="col text-center p-5">
          <LoadingOutlined />
        </div>
      }
    >
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/" component={SideDrawer} />
        <Route exact path="/category/:slug" component={CategoryHome} />
        <Route exact path="/subcategory/:slug" component={SubCategoryHome} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/forgot/password" component={ForgotPassword} />

        <UserRoute exact path="/user/history" component={History} />
        <UserRoute exact path="/user/password" component={Password} />
        <UserRoute exact path="/user/wishlist" component={Wishlist} />
        <UserRoute exact path="/payment" component={Payment} />

        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/category" component={CategoryCreate} />
        <AdminRoute exact path="/admin/products" component={AllProducts} />
        <AdminRoute
          exact
          path="/admin/product/:slug"
          component={ProductUpdate}
        />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        />
        <AdminRoute
          exact
          path="/admin/subcategory"
          component={SubCategoryCreate}
        />
        <AdminRoute
          exact
          path="/admin/subcategory/:slug"
          component={SubCategoryUpdate}
        />
        <AdminRoute exact path="/admin/product" component={ProductCreate} />
        <AdminRoute exact path="/admin/coupon" component={CreateCouponPage} />
      </Switch>
    </Suspense>
  );
};

export default App;
