import React from 'react';
import { Input, Space } from 'antd';

const { Search } = Input;

type Props = {
    onSearch: (value: string) => void;
};

const SearchArticles: React.FC<Props> = ({ onSearch }) => (
    <Space direction="vertical" style={{ marginBottom: '1rem' }}>
        <Search
            placeholder="Search articles..."
            onSearch={onSearch}
            enterButton
            allowClear
        />
    </Space>
);

export default SearchArticles;
