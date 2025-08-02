import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  category: string;
  completed: boolean;
  created_at: string;
}

interface DashboardProps {
  user: User;
  tasks: Task[];
  onLogout: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'created_at'>) => void;
  onUpdateTask: (id: number, task: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  tasks,
  onLogout,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Task Management System</h1>
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{totalTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{completedTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{totalTasks - completedTasks}</p>
          </div>
        </div>

        <div className="controls">
          <button 
            onClick={() => setShowTaskForm(true)}
            className="add-task-btn"
          >
            Add New Task
          </button>
          
          <div className="filters">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="study">Study</option>
              <option value="general">General</option>
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <TaskList
          tasks={filteredTasks}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />

        {showTaskForm && (
          <TaskForm
            onSubmit={(taskData) => {
              onAddTask(taskData);
              setShowTaskForm(false);
            }}
            onCancel={() => setShowTaskForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
