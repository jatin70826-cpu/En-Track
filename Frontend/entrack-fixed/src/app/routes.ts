import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { VerifiedNGOs } from "./pages/VerifiedNGOs";
import { NGORegistration } from "./pages/NGORegistration";
import { DonatePage } from "./pages/DonatePage";
import { DonateMoney } from "./pages/DonateMoney";
import { DonateBlood } from "./pages/DonateBlood";
import { DonateOrgan } from "./pages/DonateOrgan";
import { DonatePhysical } from "./pages/DonatePhysical";
import { History } from "./pages/History";
import { Dashboard } from "./pages/Dashboard";
import { TransactionTracking } from "./pages/TransactionTracking";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "verified-ngos", Component: VerifiedNGOs },
      { path: "ngo-registration", Component: NGORegistration },
      { path: "donate", Component: DonatePage },
      { path: "donate/money", Component: DonateMoney },
      { path: "donate/blood", Component: DonateBlood },
      { path: "donate/organ", Component: DonateOrgan },
      { path: "donate/:type", Component: DonatePhysical },
      { path: "track", Component: History },
      { path: "transaction-tracking", Component: TransactionTracking },
      { path: "dashboard", Component: Dashboard },
      { path: "contact", Component: Contact },
      { path: "login", Component: Login },
      { path: "profile", Component: Profile },
      { path: "*", Component: Home },
    ],
  },
]);
