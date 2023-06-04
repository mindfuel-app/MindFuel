import Link from "next/link"
import {FaTasks, FaUserFriends} from "react-icons/fa"
import {CiStar} from "react-icons/ci"
import {RxCalendar} from "react-icons/rx"

export default function Footer() {
    const navigation = [
        { name: 'Tareas', href: '/tareas', icon: <FaTasks className="text-3xl"/> },
        { name: 'Rutinas', href: '/rutinas', icon: <RxCalendar className="text-3xl"/>},
        { name: 'Recompensas', href: '/recompensas', icon: <CiStar className="text-3xl"/> },
        { name: 'Comunidad', href: '/comunidad', icon: <FaUserFriends className="text-3xl"/> },
    ]

    return (
        <>
            <footer className="w-full bg-white px-4 py-5 fixed bottom-0">
                <div className="flex justify-around gap-7">
                    {navigation.map(item => {
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className=""
                            >
                                {item.icon ? item.icon : item.name}
                            </Link>
                        )
                    })}
                </div>
            </footer>
        </>
    )
}