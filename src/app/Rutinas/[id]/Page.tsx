import ClientRoutine from "./Client";

export default function RoutinePage({ params }: { params: { id: string } }) {
  return <ClientRoutine id={params.id} />;
}
