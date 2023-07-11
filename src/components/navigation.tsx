import Link from "next/link";
import { FaUserFriends, FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const animationDuration = 0.3;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
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
            <span className="absolute -top-10 h-16 w-16  rounded-full bg-alabaster min-[425px]:h-[72px] min-[425px]:w-[72px]"></span>
            <Button
              disabled={router.pathname != "/home"}
              className="absolute -top-9 h-14 w-14 rounded-full border-[3px] border-teal bg-white group-active:bg-teal min-[425px]:h-16 min-[425px]:w-16"
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
          isLoading && router.pathname == "/home"
            ? "justify-stretch"
            : !isLoading && router.pathname == "/home"
            ? "justify-between"
            : isLoading && router.pathname != "/home"
            ? "justify-between"
            : "justify-stretch"
        }`}
      >
        <div
          className={`flex w-[140px] justify-evenly min-[350px]:w-[150px] min-[375px]:w-[160px] min-[425px]:w-[180px] min-[500px]:w-full ${
            previousRoute != "/home" && router.pathname != "/home"
              ? "-mr-2 flex-1"
              : isLoading && router.pathname == "/home"
              ? "-mr-2 flex-1"
              : isLoading && router.pathname != "/home"
              ? "min-[500px]:max-md:mr-5"
              : router.pathname != "/home"
              ? "-mr-2 flex-1"
              : "min-[500px]:max-md:mr-5"
          }`}
        >
          <motion.div
            layout
            transition={{
              duration: animationDuration,
            }}
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
            transition={{
              duration: animationDuration,
            }}
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
        <div
          className={`flex w-[140px] justify-evenly min-[350px]:w-[150px] min-[375px]:w-[160px] min-[425px]:w-[180px] min-[500px]:w-full ${
            previousRoute != "/home" && router.pathname != "/home"
              ? "-ml-2 flex-1"
              : isLoading && router.pathname == "/home"
              ? "-ml-2 flex-1"
              : isLoading && router.pathname != "/home"
              ? "min-[500px]:max-md:ml-5"
              : router.pathname != "/home"
              ? "-ml-2 flex-1"
              : "min-[500px]:max-md:ml-5"
          }`}
        >
          <motion.div
            layout
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
  );
}
