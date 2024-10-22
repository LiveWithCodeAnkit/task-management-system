"use client";

import { useState } from 'react';
import { Task } from '@prisma/client';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from './task-card';
import { TaskForm } from './task-form';
import { useTasks } from '@/hooks/use-tasks';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { tasks, isLoading, createTask, updateTask, deleteTask } = useTasks({
    initialTasks,
  });

  const handleSubmit = async (data: Partial<Task>) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, data);
    } else {
      await createTask(data);
    }
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTask ? 'Edit Task' : 'Create Task'}
              </DialogTitle>
            </DialogHeader>
            <TaskForm
              initialData={selectedTask || undefined}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={deleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            No tasks found. Create your first task!
          </div>
        )}
      </div>
    </div>
  );
}