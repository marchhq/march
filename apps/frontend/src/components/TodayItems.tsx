"use client";
import React, { useState, useEffect, useMemo } from 'react';
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
  const { items, isLoading } = useItems();
  const [optimisticItems, setOptimisticItems] = useState<Item[]>([]);
  const { session } = useAuth();

  useMemo(() => {
    if (!items) return [];

    const combinedItems = [
      ...items.todayItems.map((item) => ({ ...item, isOverdue: false })),
      ...items.overdueItems.map((item) => ({ ...item, isOverdue: true })),
    ];

    return combinedItems.filter(item => {
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
  }, [items, selectedDate]);

  const handleToggleComplete = async (item: Item) => {
    const updatedItems = optimisticItems.map((i) =>
      i._id === item._id ? { ...i, isCompleted: !i.isCompleted } : i
    );
    setOptimisticItems(updatedItems);
    try {
      await axios.put(
        `${BACKEND_URL}/api/items/${item._id}`,
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

  if (isLoading) {
    return <SkeletonCard />;
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
