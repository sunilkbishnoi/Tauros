
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Github, Linkedin, Twitter, X, Mail, MapPin, Briefcase, GraduationCap, Code } from "lucide-react";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
  location: string;
  biography: string;
  experience: string;
  education: string;
  skills: string[];
  projects: string[];
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

interface TeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: TeamMember[];
}

export function TeamDialog({ open, onOpenChange, teamMembers }: TeamDialogProps) {
  const isMobile = useIsMobile();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm">
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
        
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">Meet Our Team</DialogTitle>
          <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
            Our team combines expertise in finance, data science, and software engineering to build the most powerful market analytics platform.
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
          {teamMembers.map((member) => (
            <div 
              key={member.name} 
              className="relative overflow-hidden rounded-lg border border-border/30 bg-card/50 backdrop-blur-sm shadow-md transition-all hover:-translate-y-2 duration-300"
            >
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-70"></div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{member.experience} Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{member.education}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{member.location}</span>
                  </div>
                </div>
                
                <div className="flex mt-3 gap-3">
                  <a 
                    href={member.social.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s GitHub`}
                  >
                    <Github className="h-5 w-5" />
                  </a>
                  <a 
                    href={member.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a 
                    href={member.social.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`${member.name}'s Twitter`}
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a 
                    href={`mailto:${member.email}`} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                </div>
                
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground line-clamp-3">{member.biography}</p>
                </div>
                
                <div className="mt-3">
                  <h4 className="text-xs font-semibold mb-1 text-muted-foreground">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="bg-secondary/50 text-xs px-2 py-0.5 rounded-full text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
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
