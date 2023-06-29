import Link from "next/link";
import { FaTasks, FaUserFriends } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { RxCalendar } from "react-icons/rx";
import { useRouter } from "next/router";

export default function Navigation() {
  const menus = [
    {
      name: "Tareas",
      href: "/tareas",
      icon: <FaTasks className="text-3xl" />,
    },
    {
      name: "Rutinas",
      href: "/rutinas",
      icon: <RxCalendar className="text-3xl" />,
    },
    {
      name: "Premios",
      href: "/premios",
      icon: <CiStar className="text-3xl" />,
    },
    {
      name: "Amigos",
      href: "/amigos",
      icon: <FaUserFriends className="text-3xl" />,
    },
  ];

  const router = useRouter();

  return (
    <>
      <div className="no-highlight sticky bottom-0 w-full bg-white p-3">
        <ul className="flex justify-around gap-5">
          {menus.map((item) => {
            return (
              <li key={item.name} className="w-16">
                <Link
                  href={item.href}
                  className={`${
                    router.pathname == item.href ? "text-[#5C7AFF]" : ""
                  } flex flex-col items-center gap-1 rounded-xl p-1 text-center active:bg-gray-100`}
                  onClick={() => {
                    void router.push(item.href);
                  }}
                >
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
