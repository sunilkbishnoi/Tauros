
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Github, Linkedin, Twitter, Mail, Phone, MapPin, Briefcase, GraduationCap, Code, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { teamMembers } from "../footer/teamData";

type TeamMember = typeof teamMembers[0];

interface TeamMemberDetailProps {
  member: TeamMember | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamMemberDetail({ member, open, onOpenChange }: TeamMemberDetailProps) {
  const isMobile = useIsMobile();
  
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm">
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Image and basic info */}
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden mb-4">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full aspect-square object-cover"
              />
            </div>
            
            <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {member.name}
            </h3>
            
            <div className="text-lg text-muted-foreground mb-4">{member.role}</div>
            
            <div className="flex gap-4 mb-6">
              {member.social.github && (
                <a 
                  href={member.social.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {member.social.linkedin && (
                <a 
                  href={member.social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {member.social.twitter && (
                <a 
                  href={member.social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-foreground/90">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center text-foreground/90">
                <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center text-foreground/90">
                <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{member.location}</span>
              </div>
            </div>
          </div>
          
          {/* Right column - Detailed information */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-xl font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Biography
              </h4>
              <p className="text-foreground/90 leading-relaxed">
                {member.biography}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Experience
                </h4>
                <p className="text-foreground/90">{member.experience}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Education
                </h4>
                <p className="text-foreground/90">{member.education}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center">
                <Code className="h-4 w-4 mr-2" />
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-secondary/80 border border-border/30 rounded-full text-sm text-secondary-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Projects
              </h4>
              <ul className="list-disc pl-5 text-foreground/90 space-y-1">
                {member.projects.map((project, index) => (
                  <li key={index}>{project}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Mobile-friendly close button at the bottom */}
        {isMobile && (
          <div className="flex justify-center mt-6">
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
