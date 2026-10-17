import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface OptionItem<T = string | number> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface CustomSelectProps<T = string | number> {
  value: T;
  options: OptionItem<T>[];
  onChange: (val: T) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function CustomSelect<T extends string | number>({
  value,
  options,
  onChange,
  disabled = false,
  placeholder,
  className = '',
  style,
}: CustomSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`glass-select-container ${className}`}
      style={{ position: 'relative', width: '100%', ...style }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`glass-select-trigger ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: 'rgba(20, 24, 34, 0.7)',
          backdropFilter: 'blur(12px)',
          border: isOpen
            ? '1px solid var(--accent-yellow, #f5b324)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 8,
          padding: '8px 12px',
          color: disabled ? 'var(--text-dim, #64748b)' : 'var(--text, #f1f5f9)',
          fontSize: 13,
          fontWeight: 500,
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 12px rgba(245, 179, 36, 0.2)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder || String(value)}</span>
        </span>
        <ChevronDown
          size={15}
          style={{
            flexShrink: 0,
            color: 'var(--text-dim, #94a3b8)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {isOpen && (
        <div
          className="glass-select-menu"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            maxHeight: 220,
            overflowY: 'auto',
            background: 'rgba(18, 22, 32, 0.96)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: 8,
            padding: 4,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            zIndex: 1050,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`glass-select-item ${isSelected ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? 'var(--accent-yellow, #f5b324)' : '#cbd5e1',
                  background: isSelected ? 'rgba(245, 179, 36, 0.12)' : 'transparent',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#cbd5e1';
                  }
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {opt.icon}
                  <span>{opt.label}</span>
                </span>
                {isSelected && <Check size={14} color="var(--accent-yellow, #f5b324)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
