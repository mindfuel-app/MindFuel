import Link from "next/link";
import { FaUserFriends, FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";
import { Button } from "./ui/button";

export default function Navigation() {
  const menus = [
    {
      name: "Home",
      href: "/home",
      icon: <AiFillHome className="text-3xl" />,
    },
    {
      name: "Self-care",
      href: "/self-care",
      icon: <FaHandHoldingHeart className="text-3xl" />,
    },
    {
      name: "Amigos",
      href: "/amigos",
      icon: <FaUserFriends className="text-3xl" />,
    },
    {
      name: "Perfil",
      href: "/perfil",
      icon: <BsPersonCircle className="text-3xl" />,
    },
  ];

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
          className={`${
            router.pathname == "/home" ? "flex justify-between" : "hidden"
          }`}
        >
          <div className="flex w-[160px] justify-evenly">
            <Link
              href="/home"
              className={`${
                router.pathname == "/home" ? "text-[#008080]" : ""
              } flex w-[71px] flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100`}
              onClick={() => {
                void router.push("/home");
              }}
            >
              <AiFillHome className="text-3xl" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <Link
              href="/self-care"
              className={`${
                router.pathname == "/self-care" ? "text-[#008080]" : ""
              } flex w-[71px] flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100`}
              onClick={() => {
                void router.push("/self-care");
              }}
            >
              <FaHandHoldingHeart className="text-3xl" />
              <span className="text-sm font-medium">Self-care</span>
            </Link>
          </div>
          <div className="flex w-[160px] justify-evenly">
            <Link
              href="/amigos"
              className={`${
                router.pathname == "/amigos" ? "text-[#008080]" : ""
              } flex w-[71px] flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100`}
              onClick={() => {
                void router.push("/amigos");
              }}
            >
              <FaUserFriends className="text-3xl" />
              <span className="text-sm font-medium">Amigos</span>
            </Link>
            <Link
              href="/perfil"
              className={`${
                router.pathname == "/perfil" ? "text-[#008080]" : ""
              } flex w-[71px] flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100`}
              onClick={() => {
                void router.push("/perfil");
              }}
            >
              <BsPersonCircle className="text-3xl" />
              <span className="text-sm font-medium">Perfil</span>
            </Link>
          </div>
        </div>
        <ul
          className={`${
            router.pathname != "/home" ? "flex justify-around px-2" : "hidden"
          }`}
        >
          {menus.map((item) => {
            return (
              <li key={item.name} className="w-[71px]">
                <Link
                  href={item.href}
                  className={`${
                    router.pathname == item.href ? "text-[#008080]" : ""
                  } flex flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100`}
                  onClick={() => {
                    void router.push(item.href);
                  }}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
