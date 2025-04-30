
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Github, Linkedin, Twitter, X } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { teamMembers } from "./teamData";

type TeamMember = typeof teamMembers[0];

interface TeamPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: TeamMember[];
}

export function TeamPreviewDialog({ open, onOpenChange, teamMembers }: TeamPreviewDialogProps) {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
            Team Vendetta
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            The awesome people behind this project
          </DialogDescription>
        </DialogHeader>
        
        {/* Mobile-friendly close button at the top */}
        {isMobile && (
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 z-50 rounded-full bg-background/80 backdrop-blur-sm p-1 border border-border/50"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-6">
          {teamMembers.map((member) => (
            <div 
              key={member.name} 
              className="relative overflow-hidden rounded-lg border border-border/30 bg-card/50 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
              </div>
              <div className="p-4 space-y-2">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                
                <div className="flex mt-2 gap-3">
                  <a 
                    href={member.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a 
                    href={member.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a 
                    href={member.social.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s Twitter`}
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile-friendly close button at the bottom */}
        {isMobile && (
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
