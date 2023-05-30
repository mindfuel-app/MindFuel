import Link from "next/link";
import Image from "next/image";

export default function Button({iconAdress, platformName}: { iconAdress: string, platformName: string}) {
    return (
        <Link href="" className="border-2 border-[#008080] rounded-full py-1 text-lg flex items-center justify-center space-x-2 w-full px-7">
            <Image alt="Icono" src={iconAdress} width={30} height={30}></Image>
            <span>Conexion con {platformName}</span>
        </Link>
    )
}