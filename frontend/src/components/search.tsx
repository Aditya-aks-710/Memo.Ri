import { useState, type FormEvent, type FC } from 'react';
import * as Icon from '../icons';

interface SearchBarProps {
  onSearch: (query: string) => void; 
  isLoading: boolean; 
}

export const SearchBar: FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative flex items-center gap-2 md:mb-10 mb-4 max-w-2xl mx-auto"
    >
      <Icon.SearchIcon className="absolute left-4 w-6 h-6 text-gray-400 pointer-events-none" />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for articles, videos, and more..."
        className="w-full pl-12 pr-32 py-4 text-lg bg-white border-2 border-gray-200 
                   rounded-full focus:ring-1 focus:ring-[#90e8e8] focus:border-[#c4e1e1] 
                   focus:outline-none transition-shadow duration-300"
        aria-label="Search query"
      />
      
      <button
        type="submit"
        disabled={isLoading}
        className="absolute right-2 px-6 py-3 bg-[#438989] text-white font-semibold rounded-full 
                   hover:bg-[#367070] focus:outline-none focus:ring-4 focus:ring-[#8bc0c0] 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 
                   transform hover:scale-105"
      >
        {isLoading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>)
 : 'Search'}
      </button>
    </form>
  );
};
