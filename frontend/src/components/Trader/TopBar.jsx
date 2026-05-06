import { React,jsxDev } from 'react';
import { NavLink } from 'react-router-dom';
import { User } from 'lucide-react';


export default function TopBar() {
  const navLinkClass = "font-bold uppercase text-sm px-4 py-2 border-2 border-transparent transition-all duration-200 hover:border-black";
  const activeNavLinkClass = `${navLinkClass} border-black`;

  return (
    <header className="flex justify-between items-center py-4 px-8 border-b-2 border-black">
      <div className="text-2xl font-black uppercase tracking-wide">Classic Stocks</div>
      <nav className="flex gap-6">
        <NavLink to="/" className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass} end>Dashboard</NavLink>
        <NavLink to="/graphs" className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}>Graphs</NavLink>
        <NavLink to="/trade" className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}>Trade</NavLink>
        <NavLink to="/history" className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}>History</NavLink>
        <NavLink to="/alerts" className={({isActive}) => isActive ? activeNavLinkClass : navLinkClass}>Alerts</NavLink>
      </nav>
      <div className="flex items-center justify-center w-10 h-10 border-2 border-black rounded-full cursor-pointer transition-colors duration-200 hover:bg-gray-100" aria-label="User Profile">
        <User size={24} color="#000000" strokeWidth={2.5} />
      </div>
    </header>
  );
}
