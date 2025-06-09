import React from 'react';
import { Input } from 'antd';
import "@/assets/styles/articles.scss";

const { Search } = Input;

type Props = {
    onSearch: (value: string) => void;
};

const SearchArticles: React.FC<Props> = ({ onSearch }) => {
    return (
        <Search
            className="custom-search"
            placeholder="Search articles..."
            onSearch={onSearch}
            enterButton
            allowClear
            style={{
                width: '100%',
                maxWidth: 700,
                backgroundColor: 'var(--color-bg-container)',
                border: '1px solid var(--header-bg)',
                borderRadius: 8,
                color: 'var(--header-bg)',
            }}
        />

    );
};

export default SearchArticles;
