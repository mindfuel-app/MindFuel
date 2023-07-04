import Link from "next/link";
import { FaUserFriends, FaHandHoldingHeart } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useRouter } from "next/router";

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
      <div className="no-highlight fixed bottom-0 w-full bg-white px-2 py-3">
        <ul className="flex justify-around">
          {menus.map((item) => {
            return (
              <li key={item.name} className="w-48">
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
