import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PATCH(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const json = await req.json();
    const task = await prisma.task.update({
      where: {
        id: params.taskId,
        userId: session.user.id,
      },
      data: json,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('[TASK_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.task.delete({
      where: {
        id: params.taskId,
        userId: session.user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[TASK_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}