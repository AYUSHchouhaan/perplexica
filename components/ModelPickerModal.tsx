"use client"

import { DiamondIcon, InfoIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import HoldTooltip from "@/components/HoldTooltip";
import { motion } from "framer-motion";
import type { Model } from "@/lib/models";


interface ModelPickerModalProps {
  models: Model[];
  current: Model;
  theme: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (model: Model) => void;
}

// Capability badges removed per request

const ModelItem = ({
    model,
    view,
    theme,
    isCurrent,
    onSelectModel
}: {
    model: Model;
    view: 'list' | 'grid';
    theme: string;
    isCurrent: boolean;
    onSelectModel: () => void;
}) => {
    const isEnabled = model.active;
    const inactiveClasses = !isEnabled ? "opacity-50 cursor-not-allowed" : "opacity-100";
    const currentSelectionClasses = isCurrent && isEnabled ? (theme === "dark" ? "ring-1 ring-pink-500 shadow-lg shadow-pink-500/30" : "ring-1 ring-pink-500 shadow-lg shadow-pink-500/30") : "";

    const commonDivProps = {
        onClick: isEnabled ? onSelectModel : undefined,
        className: `transition duration-200 ease-in-out ${inactiveClasses} ${currentSelectionClasses} ${isEnabled ? 'cursor-pointer' : ''}`
    };

    if (view === 'list') {
        return (
            <div {...commonDivProps} className={`${commonDivProps.className} flex justify-between items-center py-2 rounded-lg ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-pink-300/10"}`}>
                <div className="flex items-center justify-between gap-3">
                    <model.logo className={`w-4 h-4 ${theme === "dark" ? "!text-pink-400/60" : "!text-pink-400/60"}`} />
                    <h2 className={`${theme === "dark" ? "!text-white" : "!text-pink-800"} !font-semibold !text-sm`}>{model.name}</h2>
                    {model.premium && (
                        <HoldTooltip tooltip="Premium" position="top" theme={theme}>
                            <DiamondIcon className="w-3 h-3 text-neutral-400" />
                        </HoldTooltip>
                    )}
                    <HoldTooltip tooltip={model.info} position="top" theme={theme}>
                        <InfoIcon className={`w-3 h-3 ${theme === "dark" ? "!text-pink-400/70" : "!text-pink-400/70"}`} />
                    </HoldTooltip>
                </div>
                {/* capability badges removed */}
            </div>
        );
    }
    return (
    <div {...commonDivProps} className={`${commonDivProps.className} flex flex-col items-center p-1.5 justify-between w-26 h-32 border !border-pink-400/30 rounded-lg ${theme === "dark" ? "hover:bg-white/10" : "bg-pink-300/10 !hover:bg-white"}`}>
            <model.logo className={`w-8 h-8 ${theme === "dark" ? "!text-white/80" : "!text-pink-950/80"}`} />
            <h2 className={`${theme === "dark" ? "!text-white" : "!text-pink-800"} text-center !font-semibold !text-sm`}>{model.name}</h2>
            {/* capability badges removed */}
        </div>
    );
};

export default function ModelPickerModal({
  models: modelsProp,
  current,
  theme,
  isOpen,
  onClose,
  onSelect,
}: ModelPickerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <motion.div
        ref={modalRef}
        layout
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className={`absolute bottom-full left-0 mb-2 z-[9999] pointer-events-auto`}
        onClick={(e) => e.stopPropagation()}
    >
        <div className={`
            px-3 py-2 rounded-lg shadow-2xl flex flex-col pointer-events-auto
            w-[320px]
            ${theme === "dark" ? "bg-[#100A0E] text-white border-neutral-700" : "bg-white text-black border-neutral-300"}
            border
        `}>
            
            <div className="max-h-[50vh] overflow-y-scroll pr-1">
                {modelsProp.map((model) => (
                    <ModelItem
                        key={model.name}
                        model={model}
                        view="list"
                        theme={theme}
                        isCurrent={model.name === current.name}
                        onSelectModel={() => onSelect(model)}
                    />
                ))}
                {modelsProp.length === 0 && <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} text-center py-4`}>No models available.</p>}
            </div>

        </div>
    </motion.div>
  );
}