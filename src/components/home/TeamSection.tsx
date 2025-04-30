
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter } from "lucide-react";
import { createBackgroundElements } from "./BackgroundElements";
import { TeamMemberDetail } from "./TeamMemberDetail"; 
import { teamMembers } from "../footer/teamData";

interface TeamSectionProps {
  animateIcons: boolean;
}

export function TeamSection({ animateIcons }: TeamSectionProps) {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Meet Our Team
        </motion.h2>
        
        <motion.p
          className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Our team combines expertise in finance, data science, and software engineering to build the most powerful market analytics platform.
        </motion.p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="relative border border-border/40 rounded-lg overflow-hidden bg-card/80 backdrop-blur-sm hover:shadow-[0_0_25px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] cursor-pointer transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedMember(member)}
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 brightness-90 contrast-105"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              </div>
              
              <div className="p-6 relative">
                <h3 className="text-xl font-bold mb-1 text-foreground">{member.name}</h3>
                <p className="text-muted-foreground mb-4">{member.role}</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {member.skills.slice(0, 3).map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  {member.social.github && (
                    <a 
                      href={member.social.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      onClick={(e) => e.stopPropagation()}
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
                      onClick={(e) => e.stopPropagation()}
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {animateIcons && createBackgroundElements(10, "team")}
      
      {/* Member detail dialog */}
      <TeamMemberDetail 
        member={selectedMember} 
        open={selectedMember !== null}
        onOpenChange={(open) => !open && setSelectedMember(null)}
      />
    </section>
  );
}
