"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../lib/constants/urls';
import { useItems } from '../hooks/useEvents';
import { useAuth } from '../contexts/AuthContext';
import { Item } from '../lib/@types/Items/TodayItems';
import { DropdownItem } from './DropDownItems';
import { SkeletonCard } from './atoms/SkeletonCard';

interface TodayEventsProps {
  selectedDate: Date;
}

export const TodayItems: React.FC<TodayEventsProps> = ({ selectedDate }): JSX.Element => {
  const items = useItems();
  const [optimisticItems, setOptimisticItems] = useState<Item[]>([]);

  useEffect(() => {
    if (items) {
      const combinedItems = [
        ...items.todayItems.map((item) => ({ ...item, isOverdue: false })),
        ...items.overdueItems.map((item) => ({ ...item, isOverdue: true })),
      ];

      const filteredItems = combinedItems.filter(item => {
        const dueDate = new Date(item.dueDate);

        if (item.isOverdue && !item.isCompleted) {
          return true;
        }

        return (
          !item.isOverdue &&
          dueDate.getFullYear() === selectedDate.getFullYear() &&
          dueDate.getMonth() === selectedDate.getMonth() &&
          dueDate.getDate() === selectedDate.getDate()
        );
      });

      setOptimisticItems(filteredItems);
    }
  }, [items, selectedDate]);

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
      setOptimisticItems(items ? [
        ...items.todayItems.map((item) => ({ ...item, isOverdue: false })),
        ...items.overdueItems.map((item) => ({ ...item, isOverdue: true })),
      ] : []);
    }
  };

  if (optimisticItems === undefined) {
    return <SkeletonCard />
  } else if (optimisticItems.length === 0) {
    return <div>no items today!</div>
  }

  return (
    <ul className="space-y-2">
      {optimisticItems.map((item) => (
        <React.Fragment key={item._id}>
          <DropdownItem item={item} onToggleComplete={handleToggleComplete} isOverdue={item.isOverdue} />
        </React.Fragment>
      ))}
    </ul>
  );
};
