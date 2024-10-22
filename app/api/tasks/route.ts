import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const task = await prisma.task.create({
      data: {
        ...json,
        userId: session.user.id,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('[TASKS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('[TASKS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}