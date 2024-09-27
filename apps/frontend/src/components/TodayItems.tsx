"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../lib/constants/urls';
import { useItems } from '../hooks/useEvents';
import { useAuth } from '../contexts/AuthContext';
import { Item } from '../lib/@types/Items/TodayItems';
import { DropdownItem } from './DropDownItems';

interface TodayEventsProps {
  selectedDate: Date;
}

export const TodayItems: React.FC<TodayEventsProps> = ({ selectedDate }): JSX.Element => {
  const items = useItems();
  const [optimisticItems, setOptimisticItems] = useState(items?.response.items || []);

  useEffect(() => {
    if (items) {
      setOptimisticItems(items.response.items);
    }
  }, [items]);

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
            Authorization: `Bearer ${session}`,
          },
        }
      );
    } catch (error) {
      console.error('Error updating item:', error);
      setOptimisticItems(items?.response.items || []);
    }
  };

  if (!optimisticItems || optimisticItems.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <ul className="space-y-2">
      {optimisticItems.map((item) => (
        <React.Fragment key={item.uuid}>
          <DropdownItem item={item} onToggleComplete={handleToggleComplete} />
        </React.Fragment>
      ))}
    </ul>
  );
};
