import Navbar from "../components/navebar.jsx";
import Sidebar from "../components/sidebar.jsx";

export default function MainLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}