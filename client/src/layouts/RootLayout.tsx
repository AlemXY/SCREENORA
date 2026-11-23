import { Outlet } from "react-router";
import MainHeader from "./MainHeader";
import MainFooter from "./MainFooter";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-screenora-bg text-white">
      <MainHeader />
      <Outlet />
      <MainFooter />
    </div>
  );
};

export default RootLayout;
