import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen md:flex bg-background text-foreground">
      <Navbar />
      <main className="flex-1 min-w-0 min-h-screen pt-20 md:pt-0">
        <div className="p-margin-mobile md:p-margin-desktop max-w-7xl mx-auto flex flex-col gap-lg pb-xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
