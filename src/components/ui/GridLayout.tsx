import React from 'react';

type GridLayoutProps = {
    header?: React.ReactNode;
    leftSidebar?: React.ReactNode;
    content?: React.ReactNode;
    rightSidebar?: React.ReactNode;
    className?: string;
};

const GridLayout: React.FC<GridLayoutProps> = ({
    header,
    leftSidebar,
    content,
    rightSidebar,
    className = '',
}) => {
    return (
        <div className={`grid grid-cols-1 -mt-8 ${className} min-h-full`}>
            {header && (
                <div className="w-full border-2 border-gray-100">
                    {header}
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 -mt-4">
                {leftSidebar && (
                    <div className="col-span-1 md:col-span-2 mb-4 md:mb-0">
                        {leftSidebar}
                    </div>
                )}
                {content && (
                    <div className="col-span-1 md:col-span-7 mb-4 md:mb-0">
                        {content}
                    </div>
                )}
                {rightSidebar && (
                    <div className="col-span-1 md:col-span-3">
                        {rightSidebar}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GridLayout;