import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { useAuthStore } from "../../store/authStore";

interface HeaderProps {
  toggleSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, title }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="md:hidden"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <div className="flex items-center gap-2 md:ml-0 flex-1">
        <h1 className="text-xl font-semibold pl-[10%]">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error-500" />
          <span className="sr-only">Notifikation</span>
        </Button>

        <div className="border-l pl-4 hidden sm:flex">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
