
import React, { useState, useEffect } from 'react';
import { useTaskStore } from '@/lib/taskStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Task } from '@/lib/types';

const SearchBar: React.FC = () => {
  const { setSearchTerm, getFilteredTasks, searchTerm } = useTaskStore();
  const [value, setValue] = useState(searchTerm);
  const [results, setResults] = useState<Task[]>([]);
  
  useEffect(() => {
    setValue(searchTerm);
    if (searchTerm) {
      setResults(getFilteredTasks());
    } else {
      setResults([]);
    }
  }, [searchTerm, getFilteredTasks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(value);
  };

  const handleClear = () => {
    setValue('');
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search tasks by title, description, or tags..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="pl-10 pr-10 py-2 bg-gray-800 border-gray-700"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {value && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" className="bg-primary-purple hover:bg-primary-dark">
          Search
        </Button>
      </form>
      
      {results.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">
            Found {results.length} {results.length === 1 ? 'result' : 'results'}
          </h4>
          <div className="space-y-2 max-h-80 overflow-y-auto glassmorphism p-3 border-gray-700 rounded-lg">
            {results.map(task => (
              <div 
                key={task.id} 
                className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg cursor-pointer"
                onClick={() => {
                  // Scroll to task element
                  const taskElement = document.getElementById(`task-${task.id}`);
                  if (taskElement) {
                    taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    taskElement.classList.add('highlight-task');
                    setTimeout(() => {
                      taskElement.classList.remove('highlight-task');
                    }, 2000);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h4>
                  {task.completed && (
                    <span className="text-xs bg-green-900/30 text-green-300 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
                
                {task.tags && task.tags.length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {task.tags.map(tag => (
                      <span 
                        key={tag}
                        className="text-xs bg-gray-700 px-1.5 rounded text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="text-xs text-gray-400 mt-1">
                  {task.parent ? `In: ${
                    task.category
                  }` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
