import Link from "next/link";
import { FaUserFriends, FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { Button } from "./ui/button";

function NavigationItem({
  href,
  icon,
  name,
}: {
  href: string;
  icon: JSX.Element;
  name: string;
}) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={`${
        router.pathname == href ? "text-[#008080]" : ""
      } flex w-[65px] flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100 min-[375px]:w-[71px]`}
      onClick={() => {
        void router.push({ href });
      }}
    >
      {icon}
      <span className="text-xs font-medium min-[375px]:text-sm">{name}</span>
    </Link>
  );
}

export default function Navigation() {
  const router = useRouter();

  return (
    <>
      <div className="no-highlight fixed bottom-0 w-full bg-white py-3">
        <div
          className={`group relative flex justify-center ${
            router.pathname != "/home" ? "hidden" : ""
          }`}
        >
          <span className="absolute -top-10 h-16 w-16 rounded-full bg-[#EDECE7] active:-top-20"></span>
          <Button className="absolute -top-9 h-14 w-14 rounded-full border-[3px] border-[#008080] bg-white group-active:bg-[#008080]">
            <span className="text-2xl font-extrabold text-[#008080] group-active:text-white">
              +
            </span>
          </Button>
        </div>
        <div
          className={`flex ${
            router.pathname == "/home" ? "justify-between" : "justify-stretch"
          }`}
        >
          <div
            className={`flex w-[140px] justify-evenly min-[350px]:w-[150px] min-[375px]:w-[160px] ${
              router.pathname != "/home" ? "-mr-2 flex-1" : ""
            }`}
          >
            <NavigationItem
              href="/home"
              icon={<AiFillHome className="text-3xl" />}
              name="Home"
            />
            <NavigationItem
              href="/self-care"
              icon={<FaHandHoldingHeart className="text-3xl" />}
              name="Self-care"
            />
          </div>
          <div
            className={`flex w-[140px] justify-evenly min-[350px]:w-[150px] min-[375px]:w-[160px] ${
              router.pathname != "/home" ? "-ml-2 flex-1" : ""
            }`}
          >
            <NavigationItem
              href="/amigos"
              icon={<FaUserFriends className="text-3xl" />}
              name="Amigos"
            />
            <NavigationItem
              href="/perfil"
              icon={<BsPersonCircle className="text-3xl" />}
              name="Perfil"
            />
          </div>
        </div>
      </div>
    </>
  );
}
