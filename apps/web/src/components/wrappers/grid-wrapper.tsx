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
      `GridWrapper: Number of children (${childCount}) exceeds maximum allowed (${maxChildren})`,
    );
  }

  const flexBasis = `${100 / Math.min(childCount, maxChildren)}%`;

  return (
    <div className="flex flex-col md:flex-row w-full h-full min-h-screen gap-4 p-4">
      {React.Children.map(children, (child, index) =>
        index < maxChildren ? (
          <div
            className="flex-1 rounded-xl bg-white p-4 min-h-[200px] md:min-h-min"
            style={{ flexBasis }}
          >
            {child}
          </div>
        ) : null,
      )}
    </div>
  );
};

export default GridWrapper;
