import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTaskStore } from '@/lib/taskStore';
import { Download, Upload, FileText, File, FileJson } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const ExportMenu: React.FC<{ taskBoardRef: React.RefObject<HTMLDivElement> }> = ({ taskBoardRef }) => {
  const { taskGroups, exportToJSON, importFromJSON } = useTaskStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importDialogOpen, setImportDialogOpen] = React.useState(false);

  const exportAsTxt = () => {
    let content = "# TASK CHECKLIST\n\n";
    
    taskGroups.forEach((group) => {
      content += `## ${group.name} (${group.type})\n\n`;
      
      group.tasks.forEach((task) => {
        content += `- [${task.completed ? 'x' : ' '}] ${task.title}\n`;
        if (task.description) content += `  Description: ${task.description}\n`;
        if (task.link) content += `  Link: ${task.link}\n`;
        if (task.dueDate) content += `  Due: ${new Date(task.dueDate).toLocaleDateString()}\n`;
        if (task.tags && task.tags.length > 0) content += `  Tags: ${task.tags.join(', ')}\n`;
        content += '\n';
      });
      
      content += "\n";
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "tasks-checklist.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Tasks exported as TXT successfully",
    });
  };

  const exportAsPdf = async () => {
    if (!taskBoardRef.current) return;
    
    toast({
      title: "Preparing PDF",
      description: "Please wait while we generate your PDF...",
    });
    
    try {
      const canvas = await html2canvas(taskBoardRef.current, {
        scale: 2,
        backgroundColor: '#121212',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save("tasks-checklist.pdf");
      
      toast({
        title: "Export Complete",
        description: "Tasks exported as PDF successfully",
      });
    } catch (error) {
      console.error("PDF export failed:", error);
      toast({
        title: "Export Failed",
        description: "There was an error generating your PDF",
        variant: "destructive",
      });
    }
  };
  
  const exportAsJSON = () => {
    const jsonData = exportToJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "tasks-backup.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Tasks backed up as JSON successfully",
    });
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        if (jsonData) {
          // Call importFromJSON and explicitly check if the result is true
          // This fixes the error: "An expression of type 'void' cannot be tested for truthiness"
          importFromJSON(jsonData);
          
          // We'll assume the import was successful if no error was thrown
          toast({
            title: "Import Complete",
            description: "Tasks imported successfully",
          });
          setImportDialogOpen(false);
        }
      } catch (error) {
        console.error("Import error:", error);
        toast({
          title: "Import Failed",
          description: "There was an error importing your tasks",
          variant: "destructive",
        });
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="flex gap-2">
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex gap-2 border-gray-600 hover:bg-gray-800 hover:text-primary-purple"
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] glassmorphism border-gray-700">
          <DialogHeader>
            <DialogTitle>Import Tasks</DialogTitle>
            <DialogDescription>
              Upload a previously exported JSON file to restore your tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="bg-gray-800 border-gray-700"
            />
            <p className="text-xs text-gray-400 mt-2">
              Only JSON files exported from this application are supported.
            </p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setImportDialogOpen(false)}
              className="border-gray-600"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex gap-2 border-gray-600 hover:bg-gray-800 hover:text-primary-purple"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="glassmorphism border-gray-700 min-w-[200px]">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700" />
          <DropdownMenuItem 
            onClick={exportAsTxt}
            className="cursor-pointer hover:bg-gray-800 hover:text-primary-purple flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Export as .TXT
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={exportAsJSON}
            className="cursor-pointer hover:bg-gray-800 hover:text-primary-purple flex items-center gap-2"
          >
            <FileJson className="h-4 w-4" />
            Backup as .JSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ExportMenu;
