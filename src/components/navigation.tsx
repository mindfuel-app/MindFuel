import Link from "next/link";
import { FaUserFriends, FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import router from "next/router";
import { motion } from "framer-motion";
import { useUser } from "~/lib/UserContext";

function NavigationItem({
  href,
  icon,
  name,
  userName,
  handleClick,
}: {
  href: string;
  icon: JSX.Element;
  name: string;
  userName: string;
  handleClick?: () => void;
}) {
  const { name: routerName } = router.query;

  return (
    <Link
      href={href}
      className={`${
        router.pathname.startsWith(href) ||
        (name == "Perfil" && routerName == userName)
          ? "text-teal"
          : ""
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

export function BottomNavigation() {
  const { name } = useUser();

  return (
    <div className="no-highlight sticky bottom-0 flex w-full justify-evenly bg-white py-3 lg:hidden">
      {navigationItems.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.name == "Perfil" ? `/${name}` : item.href}
          icon={item.icon}
          name={item.name}
          userName={name}
        />
      ))}
    </div>
  );
}

export function TopNavigation() {
  return (
    <div className="fixed left-1/2 z-10 mt-2 hidden -translate-x-1/2 gap-10 lg:flex xl:gap-16">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`no-highlight px-3 py-1.5 transition ${
            !router.pathname.startsWith(item.href) ? "hover:opacity-70" : ""
          }`}
        >
          <span
            className={`${
              router.pathname.startsWith(item.href)
                ? "font-medium"
                : "font-normal"
            }`}
          >
            {item.name}
          </span>
          {router.pathname.startsWith(item.href) && (
            <motion.div
              layoutId="active-underline"
              className="border-2 border-teal"
            ></motion.div>
          )}
        </Link>
      ))}
    </div>
  );
}
