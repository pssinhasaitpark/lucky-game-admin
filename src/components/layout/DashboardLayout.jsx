import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { closeSidebar } from "../../redux/slice/dashboardSlice.js";

const DashboardLayout = ({ children, state, dispatch, menuItems }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar state={state} dispatch={dispatch} menuItems={menuItems} />

      {/* Overlay for mobile sidebar */}
      {state.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => dispatch(closeSidebar())}
          aria-hidden="true"
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out ">
        {/* Header */}
        <Header state={state} dispatch={dispatch} />

        {/* Main content */}
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
