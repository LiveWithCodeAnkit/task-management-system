"use client";

import { format } from 'date-fns';
import { Task } from '@prisma/client';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
};

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
          </DropdownMenuContent>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(task.id)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {task.description || 'No description'}
        </p>
        <div className="flex gap-2 mt-4">
          <Badge className={statusColors[task.status]}>
            {task.status.replace('_', ' ')}
          </Badge>
          <Badge className={priorityColors[task.priority]}>
            {task.priority}
          </Badge>
        </div>
      </CardContent>
      {task.dueDate && (
        <CardFooter className="text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Due {format(new Date(task.dueDate), 'PPP')}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}