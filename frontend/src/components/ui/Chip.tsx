interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  variant?: 'category' | 'store' | 'filter';
}

export default function Chip({ label, active = false, onClick, variant = 'category' }: ChipProps) {
  const baseStyles = 'inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer';
  
  const variants = {
    category: active 
      ? 'bg-blue-600 text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    store: active 
      ? 'bg-orange-500 text-white' 
      : 'bg-white text-gray-700 border border-gray-300 hover:border-orange-500',
    filter: active 
      ? 'bg-teal-600 text-white' 
      : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {label}
    </button>
  );
}
