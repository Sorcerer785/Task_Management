import React, { useState } from 'react';

interface TaskFormProps {
  onSubmit: (task: {
    title: string;
    description: string;
    priority: string;
    category: string;
    completed: boolean;
  }) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    description: string;
    priority: string;
    category: string;
    completed: boolean;
  };
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState(initialData?.priority || 'medium');
  const [category, setCategory] = useState(initialData?.category || 'general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    onSubmit({
      title,
      description,
      priority,
      category,
      completed: initialData?.completed || false,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{initialData ? 'Edit Task' : 'Add New Task'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="priority">Priority:</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="general">General</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {initialData ? 'Update' : 'Add'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
