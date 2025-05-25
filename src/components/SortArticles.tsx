import type { MenuProps } from "antd";
import { Menu } from 'antd';

type SortArticlesProps = {
    onSort: (sortOrder: 'newest' | 'oldest') => void;
};

const items: MenuProps['items'] = [
    {
        key: 'sub1',
        label: 'Sort by date added',
        children: [
            { key: '1', label: 'Newest' },
            { key: '2', label: 'Oldest' },
        ],
    },
];

const SortArticles: React.FC<SortArticlesProps> = ({ onSort }) => {
    const onClickMenu: MenuProps['onClick'] = (e) => {
        if (e.key === '1') onSort('newest');
        else if (e.key === '2') onSort('oldest');
    };

    return (
        <Menu
            onClick={onClickMenu}
            style={{ width: 256 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
        />
    )
}

export default SortArticles;
