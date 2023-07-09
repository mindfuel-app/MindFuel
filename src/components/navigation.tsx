import Link from "next/link";
import { FaUserFriends, FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

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
        router.pathname == href ? "text-teal" : ""
      } flex w-[65px] flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100 min-[375px]:w-[71px]`}
      onClick={handleClick}
    >
      {icon}
      <span className="text-xs font-medium min-[375px]:text-sm">{name}</span>
    </Link>
  );
}
let previousRoute = "/";

export default function Navigation() {
  const router = useRouter();
  const [isClicked, setIsClicked] = useState(false);
  const animationDuration = 0.3;
  const xTranslation = 10;
  const largerXTranslation = 20;

  return (
    <>
      <div className="no-highlight fixed bottom-0 w-full bg-white py-3">
        <div className="group relative flex justify-center">
          {(router.pathname == "/home" || previousRoute == "/home") && (
            <motion.div
              className="flex justify-center"
              layout
              initial={{
                y: router.pathname == "/home" ? 10 : 0,
                opacity: router.pathname == "/home" ? 0.5 : 1,
              }}
              animate={{
                y: router.pathname == "/home" ? 0 : -20,
                opacity: router.pathname == "/home" ? 1 : 0,
              }}
            >
              <span className="absolute -top-10 h-16 w-16 rounded-full bg-alabaster"></span>
              <Button
                disabled={router.pathname != "/home"}
                className="absolute -top-9 h-14 w-14 rounded-full border-[3px] border-teal bg-white group-active:bg-teal"
              >
                <span className="text-2xl font-extrabold text-teal group-active:text-white">
                  +
                </span>
              </Button>
            </motion.div>
          )}
        </div>
        <motion.div
          layout
          className={`flex ${
            router.pathname == "/home" ? "justify-between" : "justify-stretch"
          }`}
        >
          {/* First set of navigation items */}
          <div
            className={`flex w-[140px] justify-evenly min-[350px]:w-[150px] min-[375px]:w-[160px] ${
              router.pathname != "/home" ? "-mr-2 flex-1" : ""
            }`}
          >
            <motion.div
              layout
              initial={{
                x:
                  router.pathname == "/home"
                    ? xTranslation
                    : previousRoute == "/home"
                    ? -xTranslation
                    : 0,
              }}
              animate={{ x: 0 }}
              transition={{
                duration: animationDuration,
              }}
              onClick={() => setIsClicked(!isClicked)}
            >
              <NavigationItem
                href="/home"
                icon={<AiFillHome className="text-3xl" />}
                name="Home"
                handleClick={() => {
                  previousRoute = router.pathname;
                }}
              />
            </motion.div>
            <motion.div
              layout
              initial={{
                x:
                  router.pathname == "/home"
                    ? largerXTranslation
                    : previousRoute == "/home"
                    ? -largerXTranslation
                    : 0,
              }}
              animate={{ x: 0 }}
              transition={{
                duration: animationDuration,
              }}
              onClick={() => setIsClicked(!isClicked)}
            >
              <NavigationItem
                href="/self-care"
                icon={<FaHandHoldingHeart className="text-3xl" />}
                name="Self-care"
                handleClick={() => {
                  previousRoute = router.pathname;
                }}
              />
            </motion.div>
          </div>

          {/* Second set of navigation items */}
          <div
            className={`flex w-[140px] justify-evenly min-[350px]:w-[150px] min-[375px]:w-[160px] ${
              router.pathname != "/home" ? "-ml-2 flex-1" : ""
            }`}
          >
            <motion.div
              layout
              initial={{
                x:
                  router.pathname == "/home"
                    ? -largerXTranslation
                    : previousRoute == "/home"
                    ? largerXTranslation
                    : 0,
              }}
              animate={{ x: 0 }}
              transition={{
                duration: animationDuration,
              }}
            >
              <NavigationItem
                href="/amigos"
                icon={<FaUserFriends className="text-3xl" />}
                name="Amigos"
                handleClick={() => {
                  previousRoute = router.pathname;
                }}
              />
            </motion.div>
            <motion.div
              layout
              initial={{
                x:
                  router.pathname == "/home"
                    ? -xTranslation
                    : previousRoute == "/home"
                    ? xTranslation
                    : 0,
              }}
              animate={{ x: 0 }}
              transition={{
                duration: animationDuration,
              }}
            >
              <NavigationItem
                href="/perfil"
                icon={<BsPersonCircle className="text-3xl" />}
                name="Perfil"
                handleClick={() => {
                  previousRoute = router.pathname;
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
