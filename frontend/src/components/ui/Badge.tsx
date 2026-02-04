interface BadgeProps {
  children: React.ReactNode;
  variant?: 'discount' | 'hot' | 'new' | 'featured' | 'default';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    discount: 'bg-green-500 text-white',
    hot: 'bg-orange-500 text-white',
    new: 'bg-blue-500 text-white',
    featured: 'bg-purple-500 text-white',
    default: 'bg-gray-200 text-gray-700',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
