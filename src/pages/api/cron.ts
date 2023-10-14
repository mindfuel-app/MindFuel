import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())
 
export const config = {
  runtime: 'edge',
};
 
export default async function handler() {
  try {
    const deletedValues = await prisma.selfCare.deleteMany({});
    return NextResponse.json({ deletedValues });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error},
      { status: 500 },
    );
  }
}