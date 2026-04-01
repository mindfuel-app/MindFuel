export default function Title({ title }: { title: string }) {
  return (
    <h1 className="my-4 text-2xl font-semibold tracking-tight text-eerie-black min-[360px]:text-3xl sm:text-4xl">
      {title}
    </h1>
  );
}
