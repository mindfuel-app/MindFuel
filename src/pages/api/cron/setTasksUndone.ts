import type { NextRequest } from 'next/server';
import {api} from "~/utils/api"
 
export const config = {
  runtime: 'edge',
};
 
export default function handler(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const req = api.tasks.setTaskUndone.useMutation()
}