import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./index.css";

// import Product from "./pagas/product";
// import HomePage from "./pagas/HomePage";
// import Pricing from "./pagas/Pricing";
// import PageNotFound from "./pagas/PageNotFound";
// import AppLayout from "./pagas/AppLayout";
// import Login from "./pagas/Login";
import CityList from "./components/CityList/CityList";
import CountryList from "./components/CountryList/CountryList";
import City from "./components/city/City";
import Form from "./components/form/Form";
import { CitiesProvider } from "./context/CitiesContext";
import { AuthProvider } from "./context/FakeAuthContext";

import SpinnerFullPage from "./components/SpinnerFullPage/SpinnerFullPage";

const HomePage = lazy(() => import("./pagas/HomePage"));
const Pricing = lazy(() => import("./pagas/Pricing"));
const Product = lazy(() => import("./pagas/Product"));
const PageNotFound = lazy(() => import("./pagas/PageNotFound"));
const Login = lazy(() => import("./pagas/Login"));
const AppLayout = lazy(() => import("./pagas/AppLayout"));

export default function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="product" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="app" element={<AppLayout />}>
                <Route index element={<Navigate to="cities" replace />} />
                <Route path="cities" element={<CityList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="*" element={<PageNotFound />} />
              <Route path="login" element={<Login />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}
