import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/pagamentos", label: "Pagamentos" },
  { href: "/produtos", label: "Produtos" },
  { href: "/cupons", label: "Cupons" },
  { href: "/ranking", label: "Ranking" },
  { href: "/configuracoes", label: "Configurações" },
  { href: "/health", label: "Health" },
  { href: "/onboarding", label: "Onboarding" },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const onLogout = async () => {
    // Clear local user state and send to login
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-[#f7f7f7]">
      <aside className="hidden md:block w-64 bg-white border-r border-[#e5e5e5]">
        <div className="p-6 border-b border-[#e5e5e5]">
          <h2 className="text-xl font-bold text-[#111]">Partners</h2>
          <p className="text-sm text-[#666]">MoodVerse</p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={
                  `block px-3 py-2 rounded-lg text-sm transition-colors ` +
                  (active
                    ? "bg-black text-white"
                    : "text-[#333] hover:text-black hover:bg-[#efefef]")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[#e5e5e5]">
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-[#555] hover:text-black hover:bg-[#efefef]"
          >
            Sair
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden bg-white border-b border-[#e5e5e5] px-4 py-3">
          <div className="font-semibold">Partners</div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-4 text-sm text-[#666]">{user?.email}</div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
