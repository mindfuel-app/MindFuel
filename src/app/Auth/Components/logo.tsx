import Image from "next/image";

export default function Logo() {
  return (
    <div className="hidden w-full justify-end pr-5 min-[200px]:flex xl:pr-10 ">
      <Image
        alt="Logo"
        src="/favicon.ico"
        width={75}
        height={58}
        priority={true}
      />
    </div>
  );
}
