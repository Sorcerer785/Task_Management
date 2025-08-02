import React, { useState } from 'react';
import TaskForm from './TaskForm';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  category: string;
  completed: boolean;
  created_at: string;
}

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: number, task: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleToggleComplete = (task: Task) => {
    onUpdateTask(task.id, { ...task, completed: !task.completed });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditSubmit = (updatedData: Omit<Task, 'id' | 'created_at'>) => {
    if (editingTask) {
      onUpdateTask(editingTask.id, updatedData);
      setEditingTask(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(id);
    }
  };

  const getPriorityClass = (priority: string) => {
    return `priority-${priority}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (tasks.length === 0) {
    return <div className="no-tasks">No tasks found. Add your first task!</div>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
          <div className="task-header">
            <div className="task-title-section">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
                className="task-checkbox"
              />
              <h3 className="task-title">{task.title}</h3>
            </div>
            <div className="task-actions">
              <button
                onClick={() => handleEdit(task)}
                className="edit-btn"
                disabled={task.completed}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
          
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-meta">
            <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
            <span className="category-badge">{task.category}</span>
            <span className="task-date">{formatDate(task.created_at)}</span>
          </div>
        </div>
      ))}
      
      {editingTask && (
        <TaskForm
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingTask(null)}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default TaskList;
