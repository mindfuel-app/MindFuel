import Link from "next/link"
import {FaTasks, FaUserFriends} from "react-icons/fa"
import {CiStar} from "react-icons/ci"
import {RxCalendar} from "react-icons/rx"
import { useState } from "react"

export default function Navigation() {
    const menus = [
        { name: 'Tareas', href: '/tareas', icon: <FaTasks className="text-3xl"/>, icon2: 'home-outline' },
        { name: 'Rutinas', href: '/rutinas', icon: <RxCalendar className="text-3xl"/>},
        { name: 'Premios', href: '/premios', icon: <CiStar className="text-3xl"/> },
        { name: 'Comunidad', href: '/comunidad', icon: <FaUserFriends className="text-3xl"/> },
    ]

    const [activeMenu, setActiveMenu] = useState('Tareas')

    return (
        <>
            <div className="w-full bg-white px-4 py-5 fixed bottom-0">
                <ul className="flex gap-5 justify-around">
                    {menus.map(item => {
                        return (
                            <li key={item.name} className="w-16">
                                <Link href={item.href} className={`${activeMenu == item.name ? 'text-[#5C7AFF]' : ''} gap-1 focus:bg-transparent hover:bg-transparent flex flex-col items-center text-center`} onClick={() => setActiveMenu(item.name)}>
                                    {item.icon}
                                    <span className="text-sm">{item.name}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}