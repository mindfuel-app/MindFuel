import { NextResponse } from 'next/server';
import { api } from '~/utils/api';
import prisma from '~/utils/prisma';
 
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