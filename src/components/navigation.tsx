import Link from "next/link";
import { FaUserFriends, FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";

function NavigationItem({
  href,
  icon,
  name,
  handleClick,
}: {
  href: string;
  icon: JSX.Element;
  name: string;
  handleClick?: () => void;
}) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={`${
        router.pathname.startsWith(href) ? "text-teal" : ""
      } flex w-[65px] flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100 min-[375px]:w-[71px]`}
      onClick={handleClick}
    >
      {icon}
      <span className="text-xs font-medium min-[375px]:text-sm">{name}</span>
    </Link>
  );
}

const navigationItems = [
  {
    href: "/home",
    icon: <AiFillHome className="text-3xl" />,
    name: "Home",
  },
  {
    href: "/self-care",
    icon: <FaHandHoldingHeart className="text-3xl" />,
    name: "Self-care",
  },
  {
    href: "/amigos",
    icon: <FaUserFriends className="text-3xl" />,
    name: "Amigos",
  },
  {
    href: "/perfil",
    icon: <BsPersonCircle className="text-3xl" />,
    name: "Perfil",
  },
];

export default function Navigation() {
  return (
    <div className="no-highlight fixed bottom-0 flex w-full justify-evenly bg-white py-3 lg:hidden">
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          name={item.name}
        />
      ))}
    </div>
  );
}
