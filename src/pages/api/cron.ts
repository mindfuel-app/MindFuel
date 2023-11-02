// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// export const config = {
//   runtime: "edge",
// };

// export default async function handler() {
//   try {
//     const deletedValues = await prisma.water.updateMany({
//       data: {
//         water: 0,
//       },
//     });
//     return NextResponse.json({ deletedValues });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// }
