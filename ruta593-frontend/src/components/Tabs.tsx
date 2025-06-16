import React, { useState, ReactNode } from 'react';

interface TabProps {
    title: string;
    content: ReactNode;
}

interface TabsProps {
    tabs: TabProps[];
}

const Tab: React.FC<{ title: string; isActive: boolean; onClick: () => void }> = ({
    title,
    isActive,
    onClick,
}) => (
    <button
        className={`tab text-lg ${isActive ? 'bg-blue-500 font-bold' : 'bg-white dark:bg-boxdark'} `}
        onClick={onClick}
        style={{
            padding: '3px 10px',
            borderBottom: isActive ? '2px solid #2f67c3' : '1px solid #ccc',
            cursor: 'pointer',
            outline: 'none',
            color: isActive ? 'white' : '#ccc'
        }}>
        {title}
    </button>
);

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    return (
        <div>
            <div style={{ display: 'flex' }}>
                {tabs.map((tab, index) => (
                    <Tab
                        key={index}
                        title={tab.title}
                        isActive={activeTabIndex === index}
                        onClick={() => setActiveTabIndex(index)}
                    />
                ))}
            </div>
            <div className=' bg-white dark:bg-boxdark p-5' style={{ border: '1px solid #ccc' }}>
                {tabs[activeTabIndex].content}
            </div>
        </div>
    );
};

export default Tabs;