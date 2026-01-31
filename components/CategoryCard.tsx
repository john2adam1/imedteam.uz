import Link from 'next/link';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
        {category.description && (
          <p className="text-gray-600 text-sm">{category.description}</p>
        )}
      </div>
    </Link>
  );
}

