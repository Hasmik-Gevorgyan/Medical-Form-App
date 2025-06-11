import React from 'react';
import type { MenuProps } from 'antd';
import { Dropdown, Button } from 'antd';

type SortArticlesProps = {
    onSort: (sortOrder: 'newest' | 'oldest') => void;
};

const items: MenuProps['items'] = [
    { key: 'newest', label: 'Newest' },
    { key: 'oldest', label: 'Oldest' },
];

const SortArticles: React.FC<SortArticlesProps> = ({ onSort }) => {
    const handleMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === 'newest' || e.key === 'oldest') {
            onSort(e.key);
        }
    };

    return (
        <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomRight">
            <Button
                style={{
                    backgroundColor: 'var(--header-bg)',
                    color: 'var(--header-text)',
                    border: 'none',
                    borderRadius: 8,
                }}
            >
                Sort By
            </Button>
        </Dropdown>
    );
};

export default SortArticles;
