import { useState } from "react";
import CesiumViewer from "./CesiumViewer";
import MainPage1 from "./MainPage1";
import MainPage3 from "./MainPage3";
import MainPage2 from "./MainPage2";
import Header from "./Header";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <Header />

      {/* MainPage1 */}
      <MainPage1 />

      {/* MainPage2 */}
      <MainPage2 />

      {/* MainPage3 */}
      <MainPage3 />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default Layout;