export default function Title({ title }: { title: string }) {
  return (
    <h1 className="my-5 text-xl font-semibold text-teal min-[360px]:text-2xl sm:text-3xl lg:-my-1">
      {title}
    </h1>
  );
}
