
import { Users } from "lucide-react";
import { useState } from "react";
import { TeamPreviewDialog } from "./TeamPreviewDialog";
import { teamMembers } from "./teamData";

export function FooterBottom() {
  const [isTeamPreviewOpen, setIsTeamPreviewOpen] = useState(false);

  return (
    <div className="mt-8 pt-4 border-t border-border/20 flex justify-center items-center">
      <button 
        onClick={() => setIsTeamPreviewOpen(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors group"
      >
        <Users className="h-3.5 w-3.5 group-hover:text-primary transition-colors" />
        <span>Made By Team Vendetta</span>
      </button>
      
      <TeamPreviewDialog 
        open={isTeamPreviewOpen}
        onOpenChange={setIsTeamPreviewOpen}
        teamMembers={teamMembers}
      />
    </div>
  );
}
