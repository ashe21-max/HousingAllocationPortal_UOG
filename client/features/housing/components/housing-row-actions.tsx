"use client";

import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";

type HousingRowActionsProps = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function HousingRowActions({
  onView,
  onEdit,
  onDelete,
}: HousingRowActionsProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Position the menu ABOVE the trigger, aligned to the right edge
      // Approximate height of 3 items + padding + divider is ~165-170px
      // Using 180 as a safe upper bound to ensure clear visibility
      setMenuPosition({
        top: rect.top + window.scrollY - 170, 
        left: rect.right + window.scrollX - 160,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (triggerRef.current?.contains(event.target as Node)) return;
      
      const menuPortals = document.querySelectorAll("[data-row-menu]");
      let clickedInsidePortal = false;
      menuPortals.forEach(portal => {
        if (portal.contains(event.target as Node)) clickedInsidePortal = true;
      });

      if (!clickedInsidePortal) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handlePointerDown);
      window.addEventListener("scroll", () => setIsOpen(false), { passive: true });
      window.addEventListener("resize", () => setIsOpen(false));
    }
    
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("scroll", () => setIsOpen(false));
      window.removeEventListener("resize", () => setIsOpen(false));
    };
  }, [isOpen]);

  function handleAction(action: () => void) {
    setIsOpen(false);
    action();
  }

  const dropdownMenu = (
    <div 
      data-row-menu
      className="fixed z-[9999] flex flex-col min-w-[160px] max-h-[170px] overflow-y-auto border border-[var(--border)] bg-white py-1 shadow-[0_-12px_40px_rgba(42,35,57,0.18)] rounded-none animate-in fade-in slide-in-from-bottom-2 duration-150 origin-bottom custom-scrollbar"
      style={{ top: menuPosition.top, left: menuPosition.left }}
    >
      <button
        type="button"
        onClick={() => handleAction(onView)}
        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:bg-[var(--surface-muted)] transition-colors w-full text-left"
      >
        <Eye className="h-4 w-4 text-muted" />
        View Detail
      </button>
      <button
        type="button"
        onClick={() => handleAction(onEdit)}
        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:bg-[var(--surface-muted)] transition-colors w-full text-left"
      >
        <Pencil className="h-4 w-4 text-muted" />
        Edit Asset
      </button>
      <div className="h-[1px] bg-[var(--border)] my-1 mx-2 opacity-50"></div>
      <button
        type="button"
        onClick={() => handleAction(onDelete)}
        className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--color-danger)] hover:bg-red-50 transition-colors w-full text-left"
      >
        <Trash2 className="h-4 w-4" />
        Delete Unit
      </button>
    </div>
  );

  return (
    <div className="inline-flex">
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className={`h-9 w-9 p-0 border-transparent hover:bg-[var(--surface-muted)] text-muted transition-colors ${isOpen ? 'bg-[var(--surface-muted)] text-[var(--color-primary)]' : ''}`}
        onClick={() => setIsOpen((current) => !current)}
      >
        <MoreHorizontal className="h-5 w-5" />
      </Button>

      {isOpen && typeof document !== "undefined" && createPortal(dropdownMenu, document.body)}
    </div>
  );
}
