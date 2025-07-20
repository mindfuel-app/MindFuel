"use client";
import Link from "next/link";
import { FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useUser } from "~/contexts/UserContext";
import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";
import AddButton from "./addButton";
import { useTheme } from "~/contexts/ThemeContext";

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
  const router = useRouter();
  const { name: routerName } = router.query;
  const { themeColor } = useTheme();

  return (
    <Link
      href={href}
      className={`${router.pathname.startsWith(href) ||
          (router.pathname.startsWith("/rutinas") && href == "/home") ||
          (name == "Perfil" && routerName == userName)
          ? `text-${themeColor}`
          : "text-gray-700"
        } flex w-[65px] flex-col items-center gap-1 rounded-xl p-1 text-center transition-colors active:bg-gray-100 min-[375px]:w-[71px]`}
      onClick={handleClick}
    >
      {icon}
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
  // {
  //   href: "/amigos",
  //   icon: <FaUserFriends className="text-3xl" />,
  //   name: "Amigos",
  // },
  {
    href: "/perfil",
    icon: <BsPersonCircle className="text-3xl" />,
    name: "Perfil",
  },
];

export function Footer() {
  const router = useRouter();
  const { name } = useUser();
  const [show, setShow] = useState(true);
  const scrollThreshold = 50;
  const isInHome = router.pathname == "/home";

  useEffect(() => {
    if (!isInHome) return;
    let lastScrollTop = 0;

    function handleScroll() {
      const st = window.scrollY || document.documentElement.scrollTop;
      const scrollDirection = st > lastScrollTop ? 1 : -1;

      if (Math.abs(st - lastScrollTop) > scrollThreshold) {
        setShow(scrollDirection === -1);
        lastScrollTop = st <= 0 ? 0 : st;
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <motion.footer
        animate={{ y: show ? "0%" : "100%" }}
        transition={{ duration: 0.15 }}
        className="no-highlight fixed bottom-0 z-20 flex w-full justify-evenly border-t border-gray-200 bg-white py-3"
      >
        {navigationItems.map((item) => (
          <NavigationItem
            key={item.href}
            href={item.name == "Perfil" ? `/${name}` : item.href}
            icon={item.icon}
            name={item.name}
            userName={name}
          />
        ))}
      </motion.footer>
      {isInHome && (
        <motion.div
          animate={{
            bottom: show ? "100px" : "35px",
            right: show ? "80px" : "50px",
          }}
          transition={{ duration: 0.1 }}
          className="fixed"
        >
          <AddButton showLabel={show} />
        </motion.div>
      )}
    </>
  );
}

export function TopNavigation() {
  const { name } = useUser();
  const router = useRouter();
  const paramName = router.query.name;
  const { themeColor } = useTheme();
  const isInProfilePage = paramName == name;

  return (
    <div className="absolute left-1/2 z-10 mt-2 flex -translate-x-1/2 gap-16 xl:gap-20">
      {navigationItems.map((item) => (
        <Link
          key={item.name}
          href={item.name == "Perfil" ? `/${name}` : item.href}
          className={cn(
            "no-highlight p-1 transition",
            !router.pathname.startsWith(item.href) && "hover:opacity-70"
          )}
        >
          <span
            className={cn(
              isInProfilePage && "text-white",
              router.pathname.startsWith(item.href)
                ? "font-medium"
                : "font-normal"
            )}
          >
            {item.name}
          </span>
          {(router.pathname.startsWith(item.href) ||
            (isInProfilePage && item.name == "Perfil")) && (
              <div
                className={cn(
                  "border-2",
                  isInProfilePage
                    ? "border-white"
                    : themeColor == "teal"
                      ? "border-teal"
                      : "border-orange-red"
                )}
              />
            )}
        </Link>
      ))}
    </div>
  );
}
