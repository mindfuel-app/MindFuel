import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex w-full justify-end pr-5 xl:pr-10">
      <Image alt="Logo" src="/favicon.ico" width={75} height={58}></Image>
    </div>
  );
}
