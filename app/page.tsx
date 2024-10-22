import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TaskList } from '@/components/tasks/task-list';

export const metadata: Metadata = {
  title: 'Task Management System',
  description: 'Manage your tasks efficiently',
};

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth');
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="container mx-auto py-10">
      <TaskList initialTasks={tasks} />
    </div>
  );
}