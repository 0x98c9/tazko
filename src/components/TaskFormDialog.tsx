
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskCategory, TaskPriority } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { useTaskStore } from '@/lib/taskStore';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, Link, Image, Tags, Repeat } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupType: TaskCategory;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  groupType,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>(groupType);
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [recurringFrequency, setRecurringFrequency] = useState(1);
  const [activeTab, setActiveTab] = useState('basic');
  
  const { addTask } = useTaskStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive",
      });
      return;
    }
    
    addTask(
      title.trim(), 
      category, 
      groupId,
      {
        description: description.trim() || undefined,
        link: link.trim() || undefined,
        imageUrl: imageUrl.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        priority,
        dueDate: date ? date.getTime() : undefined,
        recurring: recurringEnabled ? {
          enabled: true,
          interval: recurringInterval,
          frequency: recurringFrequency
        } : undefined
      }
    );
    
    // Reset form
    resetForm();
    onOpenChange(false);
    
    toast({
      title: "Success",
      description: "Task created successfully",
    });
  };

  const resetForm = () => {
    setTitle('');
    setCategory(groupType);
    setDescription('');
    setLink('');
    setImageUrl('');
    setPriority('Medium');
    setDate(undefined);
    setTags([]);
    setTagInput('');
    setRecurringEnabled(false);
    setRecurringInterval('daily');
    setRecurringFrequency(1);
    setActiveTab('basic');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[550px] glassmorphism border-gray-700">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task in this group with extended options.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full pt-2">
            <TabsList className="grid grid-cols-4 mb-4 bg-gray-800">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Category</Label>
                <RadioGroup
                  value={category}
                  onValueChange={(value) => setCategory(value as TaskCategory)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Subject" id="subject" />
                    <Label htmlFor="subject">Subject</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Project" id="project" />
                    <Label htmlFor="project">Project</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details about this task..."
                  className="bg-gray-800 border-gray-700 min-h-[100px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2" htmlFor="link">
                  <Link className="h-4 w-4" />
                  Resource Link
                </Label>
                <Input
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://..."
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="flex items-center gap-2" htmlFor="imageUrl">
                  <Image className="h-4 w-4" />
                  Image URL
                </Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-800 border-gray-700"
                />
                {imageUrl && (
                  <div className="mt-2 relative w-full h-32 rounded-md overflow-hidden bg-gray-800">
                    <img 
                      src={imageUrl} 
                      alt="Task preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+URL";
                      }}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="space-y-4">
              <div className="grid gap-2">
                <Label className="flex items-center gap-2">
                  <Tags className="h-4 w-4" />
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="flex items-center gap-1 bg-gray-700"
                    >
                      {tag}
                      <button 
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-xs ml-1 hover:text-white"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type and press Enter to add tags..."
                  className="bg-gray-800 border-gray-700"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Press Enter or comma to add a tag
                </p>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="glassmorphism border-gray-700">
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-800 border-gray-700",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>No due date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 glassmorphism border-gray-700">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                    {date && (
                      <div className="p-2 border-t border-gray-700 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDate(undefined)}
                        >
                          Clear
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </TabsContent>
            
            <TabsContent value="recurring" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="recurring-toggle" className="flex items-center gap-2">
                  <Repeat className="h-4 w-4" />
                  Recurring Task
                </Label>
                <Switch 
                  id="recurring-toggle"
                  checked={recurringEnabled}
                  onCheckedChange={setRecurringEnabled}
                />
              </div>
              
              {recurringEnabled && (
                <div className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="interval">Repeat every</Label>
                    <div className="flex gap-2">
                      <Input
                        id="frequency"
                        type="number"
                        min="1"
                        max="30"
                        value={recurringFrequency}
                        onChange={(e) => setRecurringFrequency(parseInt(e.target.value) || 1)}
                        className="w-20 bg-gray-800 border-gray-700"
                      />
                      
                      <Select 
                        value={recurringInterval} 
                        onValueChange={(value) => setRecurringInterval(value as 'daily' | 'weekly' | 'monthly')}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-700 flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glassmorphism border-gray-700">
                          <SelectItem value="daily">
                            {recurringFrequency > 1 ? 'Days' : 'Day'}
                          </SelectItem>
                          <SelectItem value="weekly">
                            {recurringFrequency > 1 ? 'Weeks' : 'Week'}
                          </SelectItem>
                          <SelectItem value="monthly">
                            {recurringFrequency > 1 ? 'Months' : 'Month'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400">
                    {!date ? (
                      "Please set a due date for this recurring task"
                    ) : (
                      <>
                        This task will repeat every{' '}
                        {recurringFrequency > 1 ? `${recurringFrequency} ` : ''}
                        {recurringInterval === 'daily' && (recurringFrequency > 1 ? 'days' : 'day')}
                        {recurringInterval === 'weekly' && (recurringFrequency > 1 ? 'weeks' : 'week')}
                        {recurringInterval === 'monthly' && (recurringFrequency > 1 ? 'months' : 'month')}
                        {' '}after completion
                      </>
                    )}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogClose(false)}
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-primary-purple hover:bg-primary-dark"
            >
              Add Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskFormDialog;
