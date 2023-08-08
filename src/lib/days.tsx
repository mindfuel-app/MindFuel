const dayOptions = [
  { label: "D", value: "Dom" },
  { label: "L", value: "Lun" },
  { label: "M", value: "Mar" },
  { label: "M", value: "Mie" },
  { label: "J", value: "Jue" },
  { label: "V", value: "Vie" },
  { label: "S", value: "Sab" },
];

function orderDays(days: string): string {
  const dayOrder = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

  const sortedDays = days
    .split(", ")
    .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
    .join(", ");

  return sortedDays;
}

export { dayOptions, orderDays };
