import NavLinks from "./NavLinks";
import NavUser from "./NavUser";

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full">
      <div className="flex flex-row gap-8 border-4 border-amber-200 h-16 w-full justify-between">
        <NavLinks />
        <NavUser />
      </div>
    </nav>
  );
}
