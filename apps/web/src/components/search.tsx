"use client";

import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function SearchInput() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const projectsData: any[] = []

  const filteredProjects =
    projectsData?.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:block">Search projects...</span>
        <kbd className="ml-2 px-2 py-1 text-xs bg-muted rounded hidden md:block">
          ⌘K
        </kbd>
      </Button>

      <CommandDialog className="max-w-sm" open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search projects..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="max-w-sm"
        />
        <CommandList>
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup heading="Featured Projects">
            {filteredProjects
              .filter(
                (project) => (project.orgMetadata?.fundRaised ?? 0) >= 25000000
              )
              .map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => {
                    setOpen(false);
                  }}
                  className="flex items-center gap-3"
                >
                  {project.logoUrl && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={project.logoUrl}
                        alt={project.name}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {project.description?.slice(0, 50)}...
                    </div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="All Projects">
            {filteredProjects
              .filter(
                (project) => (project.orgMetadata?.fundRaised ?? 0) < 25000000
              )
              .map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => {
                    setOpen(false);
                  }}
                  className="flex items-center gap-3"
                >
                  {project.logoUrl && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={project.logoUrl}
                        alt={project.name}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {project.description?.slice(0, 50)}...
                    </div>
                  </div>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}