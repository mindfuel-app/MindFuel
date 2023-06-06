import Link from "next/link"
import {FaTasks, FaUserFriends} from "react-icons/fa"
import {CiStar} from "react-icons/ci"
import {RxCalendar} from "react-icons/rx"
import { useState } from "react"

export default function Footer() {
    const navigation = [
        { name: 'Tareas', href: '/tareas', icon: <FaTasks className="text-3xl"/> },
        { name: 'Rutinas', href: '/rutinas', icon: <RxCalendar className="text-3xl"/>},
        { name: 'Recompensas', href: '/recompensas', icon: <CiStar className="text-3xl"/> },
        { name: 'Comunidad', href: '/comunidad', icon: <FaUserFriends className="text-3xl"/> },
    ]

    const [activeElement, setActiveElement] = useState('Tareas')

    return (
        <>
            <footer className="w-full bg-white px-4 py-5 fixed bottom-0">
                <div className="flex justify-around gap-7">
                    {navigation.map(item => {
                        return (
                            <div key={item.name} className={activeElement == item.name ? 'bg-slate-400  px-4 py-2' : 'px-4 py-2'}>
                                <Link
                                    href='/tareas'
                                    className=""
                                    onClick={() => setActiveElement(item.name)}
                                >
                                    {item.icon}
                                </Link>
                            </div>
                            
                        )
                    })}
                </div>
            </footer>
        </>
    )
}