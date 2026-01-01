import loadable from "@loadable/component";

// layouts
import { View, Auth } from "./layouts";
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";

// auth
const SignUp = loadable(() =>
  import("views").then((module) => ({
    default: module.SignUp,
  }))
);
const SignIn = loadable(() =>
  import("views").then((module) => ({
    default: module.SignIn,
  }))
);
const SignOut = loadable(() =>
  import("views").then((module) => ({
    default: module.SignOut,
  }))
);
const UpdatePassword = loadable(() =>
  import("views").then((module) => ({
    default: module.UpdatePassword,
  }))
);
const Recovery = loadable(() =>
  import("views").then((module) => ({
    default: module.Recovery,
  }))
);
// view
const Home = loadable(() =>
  import("views").then((module) => ({
    default: module.Home,
  }))
);
const NotFound = loadable(() =>
  import("views").then((module) => ({
    default: module.NotFound,
  }))
);

// Info
const About = loadable(() =>
  import("views").then((module) => ({
    default: module.About,
  }))
);
const CookiesPolicy = loadable(() =>
  import("views").then((module) => ({
    default: module.CookiesPolicy,
  }))
);
const PrivacyPolicy = loadable(() =>
  import("views").then((module) => ({
    default: module.PrivacyPolicy,
  }))
);
const TermsAndConditions = loadable(() =>
  import("views").then((module) => ({
    default: module.TermsAndConditions,
  }))
);

// Entities
const Checklists = loadable(() =>
  import("views").then((module) => ({
    default: module.Checklists,
  }))
);
const Products = loadable(() =>
  import("views").then((module) => ({
    default: module.Products,
  }))
);
const ProductCategories = loadable(() =>
  import("views").then((module) => ({
    default: module.ProductCategories,
  }))
);
const Currencies = loadable(() =>
  import("views").then((module) => ({
    default: module.Currencies,
  }))
);

export const Routes = () => {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route path="/auth/" element={<Auth />}>
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/update-password" element={<UpdatePassword />} />
          <Route path="/auth/recovery" element={<Recovery />} />
          <Route path="/auth/*" element={<NotFound />} />
        </Route>
        <Route path="/sign-out" element={<SignOut />} />
        <Route path="/" element={<View />}>
          <Route index element={<Home />} />
          <Route path="/checklists" element={<Checklists />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product-categories" element={<ProductCategories />} />
          <Route path="/currencies" element={<Currencies />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </ReactRoutes>
    </BrowserRouter>
  );
};
