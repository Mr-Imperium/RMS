import React from 'react';

/**
 * A component to highlight occurrences of a search term within a block of text.
 * @param {object} props
 * @param {string} props.text - The full text to display.
 * @param {string} props.highlight - The term to highlight.
 */
const SearchHighlighter = ({ text, highlight }) => {
  if (!highlight || !text) {
    return text;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
      )}
    </span>
  );
};

export default SearchHighlighter;