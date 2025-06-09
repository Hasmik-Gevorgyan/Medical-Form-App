export const getNamesByIds = <T extends { id: string; name: string }>(
    ids: string[],
    items: T[]
): string[] => {
    return ids
        ?.map(id => items.find((item: T) => item.id === id)?.name)
        .filter(name => name != null);
};
