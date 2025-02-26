import React, { ReactNode } from "react";

interface GridWrapperProps {
  children: ReactNode;
  maxChildren?: number;
}

const GridWrapper: React.FC<GridWrapperProps> = ({
  children,
  maxChildren = 4,
}) => {
  const childCount = React.Children.count(children);

  if (childCount > maxChildren) {
    console.warn(
      `GridWrapper: Number of children (${childCount}) exceeds maximum allowed (${maxChildren})`
    );
  }

  return (
    <div className="grid auto-cols-[minmax(0,1fr)] grid-flow-col w-full h-full gap-3">
      {React.Children.map(children, (child, index) =>
        index < maxChildren ? (
          <div className="w-full h-full overflow-auto">
            {child}
          </div>
        ) : null
      )}
    </div>
  );
};

export default GridWrapper;
