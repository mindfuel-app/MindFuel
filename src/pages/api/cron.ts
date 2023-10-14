import { NextResponse } from 'next/server';
import { api } from '~/utils/api';
 
export const config = {
  runtime: 'edge',
};
 
export default function handler() {
  try {
    const deletedValues = api.selfCare.clearValues.useMutation({});
    return NextResponse.json({ deletedValues });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error},
      { status: 500 },
    );
  }
}