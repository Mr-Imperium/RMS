import React from 'react';
import { FixedSizeList as List } from 'react-window';
import { Box } from '@mui/material';

/**
 * A virtualized list for rendering a large number of items efficiently.
 * @param {object} props
 * @param {Array<object>} props.items - The full list of items to render.
 * @param {function({index: number, style: object}): React.ReactNode} props.renderRow - A function to render a single row.
 * @param {number} props.itemHeight - The fixed height of each row in pixels.
 * @param {number} props.height - The total height of the list container.
 */
const VirtualizedList = ({ items, renderRow, itemHeight, height }) => {
    const Row = ({ index, style }) => {
        return (
            <Box style={style}>
                {renderRow({ item: items[index], style })}
            </Box>
        );
    };

    return (
        <List
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width="100%"
        >
            {Row}
        </List>
    );
};

export default VirtualizedList;