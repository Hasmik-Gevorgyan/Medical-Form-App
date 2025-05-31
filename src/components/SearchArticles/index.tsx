import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

type Props = {
    onSearch: (value: string) => void;
};

const SearchArticles: React.FC<Props> = ({ onSearch }) => {
    return (
        <Search
            placeholder="Search articles..."
            onSearch={onSearch}
            enterButton
            allowClear
            style={{ width: '100%' }}
        />
    );
};

export default SearchArticles;
