import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSearch } from '@fortawesome/free-solid-svg-icons';
import '../Styles/Search.css';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsVisible, setSearchResultsVisible] = useState(false);
    const debounceTimeout = useRef(null);

    const handleSearchChange = (e) => {
        const query = e.target.value;
    
        // Capitalize the first letter of each word
        const capitalizeWords = (str) => {
            return str
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        };
    
        const formattedQuery = capitalizeWords(query);
    
        console.log('Search query:', formattedQuery);
        setSearchQuery(formattedQuery); // Set the formatted query
    
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    
        debounceTimeout.current = setTimeout(() => {
            if (formattedQuery.trim()) {
                performSearch(formattedQuery.trim());
            } else {
                setSearchResults([]); // Clear results if query is empty
            }
        }, 1000); // Debounce time
    };
    

    const performSearch = async (query) => {
        console.log("Performing search for:", query);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/search?searchTerm=${query}`);
            console.log("Search results:", response.data);
            setSearchResults(response.data.data); // Ensure the correct data is set
            setSearchResultsVisible(true); // Ensure the search results container is visible
        } catch (error) {
            console.error('Search request failed:', error);
        }
    };

    useEffect(() => {
        const handleSearchBlur = (e) => {
            console.log('Search input blurred (useEffect)');
            if (!e.relatedTarget || !e.relatedTarget.closest('.search-container-result')) {
                setSearchResults([]);
                setSearchResultsVisible(false);
            }
        };

        const handleSearchFocus = () => {
            console.log('Search input focused (useEffect)');
            if (searchQuery.trim()) {
                performSearch(searchQuery.trim());
            }
            setSearchResultsVisible(true);
        };

        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('blur', handleSearchBlur);
            searchInput.addEventListener('focus', handleSearchFocus);
        }

        return () => {
            if (searchInput) {
                searchInput.removeEventListener('blur', handleSearchBlur);
                searchInput.removeEventListener('focus', handleSearchFocus);
            }
        };
    }, [searchQuery]);

    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search..."
            />
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            {searchResultsVisible && searchResults.length > 0 && (
                <div className="search-container-result">
                    {console.log('Rendering search results container')}
                    {searchResults.map((result, index) => (
                        <div key={`${result.id}-${index}`} className="search-container-result-item">
                            <img
                                src={`${import.meta.env.VITE_API_URL}${result.image_path}`}
                                alt={result.title}
                                className="result-image"
                            />
                            <div className="result-details">
                                <h3 className="result-title">{result.title}</h3>
                                <p className="result-info">
                                    {result.kind} &middot; {new Date(result.released_date).getFullYear()} &middot; {result.duration_minutes} min
                                </p>
                                <div className="result-rating">
                                    <FontAwesomeIcon icon={faStar} className="star-icon" />
                                    <span>{result.rating || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;