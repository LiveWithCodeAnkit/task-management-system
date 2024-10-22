"use client";

import { useState } from 'react';
import { Task, TaskStatus, Priority } from '@prisma/client';
import { useToast } from '@/components/ui/use-toast';

interface UseTasksProps {
  initialTasks?: Task[];
}

export const useTasks = ({ initialTasks = [] }: UseTasksProps = {}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createTask = async (data: Partial<Task>) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      
      const newTask = await response.json();
      setTasks((prev) => [...prev, newTask]);
      toast({ title: 'Task created successfully' });
    } catch (error) {
      toast({ 
        title: 'Error creating task',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      const updatedTask = await response.json();
      setTasks((prev) => 
        prev.map((task) => task.id === id ? updatedTask : task)
      );
      toast({ title: 'Task updated successfully' });
    } catch (error) {
      toast({ 
        title: 'Error updating task',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      setTasks((prev) => prev.filter((task) => task.id !== id));
      toast({ title: 'Task deleted successfully' });
    } catch (error) {
      toast({ 
        title: 'Error deleting task',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
  };
};