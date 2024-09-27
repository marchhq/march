import React, { useState } from 'react';
import { Box, CheckedBox } from '../lib/icons/Box';
import { Item } from '../lib/@types/Items/TodayItems';
import { AddToSpace } from './AddToSpace';

interface DropdownItemProps {
  item: Item;
  onToggleComplete: (item: Item) => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ item, onToggleComplete }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="flex items-center justify-start gap-2 relative">
      <button onClick={() => onToggleComplete(item)}>
        {item.isCompleted ? <CheckedBox /> : <Box />}
      </button>
      <li className={`${item.isCompleted ? 'text-[#6D7077]' : 'text-white'} flex items-center gap-4 justify-start`}>
        {item.title}
      </li>
      <button
        onClick={() => setShowDropdown(!showDropdown)}

      >
        <AddToSpace />
      </button>
    </div>
  );
};
