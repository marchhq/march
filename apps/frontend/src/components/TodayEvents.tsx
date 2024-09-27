"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../lib/constants/urls';
import { useItems } from '../hooks/useEvents';
import { Item } from '../lib/@types/Items/TodayItems';
import { useAuth } from '../contexts/AuthContext';
import { Box, CheckedBox } from '../lib/icons/Box';
import { Space } from '../lib/icons/Space';

interface TodayEventsProps {
  selectedDate: Date;
}

export const TodayEvents: React.FC<TodayEventsProps> = ({ selectedDate }): JSX.Element => {
  const itemsData = useItems();
  const [optimisticItems, setOptimisticItems] = useState(itemsData?.response.items || []);
  const [space, setSpace] = useState<string | null>(null);

  useEffect(() => {
    if (itemsData) {
      setOptimisticItems(itemsData.response.items);
    }
  }, [itemsData]);


  const { session } = useAuth();

  const handleToggleComplete = async (item: Item) => {
    const updatedItems = optimisticItems.map((i) =>
      i.uuid === item.uuid ? { ...i, isCompleted: !i.isCompleted } : i
    );
    setOptimisticItems(updatedItems);

    try {
      await axios.put(
        `${BACKEND_URL}/api/items/${item.uuid}`,
        { isCompleted: !item.isCompleted },
        {
          headers: {
            Authorization: `Bearer ${session}`
          },
        }
      );
    } catch (error) {
      console.error('Error updating item:', error);
      setOptimisticItems(itemsData?.response.items || []);
    }
  };

  if (!optimisticItems || optimisticItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="space-y-2">
      {optimisticItems.map((item) => (
        <React.Fragment key={item.uuid}>
          <div
            onMouseEnter={() => setSpace(item.uuid)}
            onMouseLeave={() => setSpace(null)}
            className="flex items-center justify-start gap-2">
            <button onClick={() => handleToggleComplete(item)}>
              {item.isCompleted ? <CheckedBox /> : <Box />}
            </button>
            <li className={` ${item.isCompleted ? 'text-[#6D7077]' : ''} text-white flex items-center gap-4 justify-start`}>
              {item.title}
            </li>
            {space === item.uuid && (
              <Space />
            )}
          </div>
        </React.Fragment>
      ))}
    </ul>
  );
};
