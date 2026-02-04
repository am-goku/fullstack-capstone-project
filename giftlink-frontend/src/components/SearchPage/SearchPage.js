import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchPage.css';
import { urlConfig } from '../../config';

function SearchPage() {

    // Task 1: Define state variables for the search query, age range, and search results.
    const [searchQuery, setSearchQuery] = useState('');
    const [ageRange, setAgeRange] = useState(10);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const navigate = useNavigate();

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                console.log(url)
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);


    // Task 2. Fetch search results from the API based on user inputs.
    const handleSearch = async () => {
        try {
            let url = `${urlConfig.backendUrl}/api/search?`;
            const params = new URLSearchParams();

            if (searchQuery) {
                params.append('name', searchQuery);
            }
            if (selectedCategory) {
                params.append('category', selectedCategory);
            }
            if (selectedCondition) {
                params.append('condition', selectedCondition);
            }
            if (ageRange) {
                params.append('age_years', ageRange);
            }

            url += params.toString();
            console.log('Search URL:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error; ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.log('Search error: ' + error.message);
        }
    };

    // Task 6. Enable navigation to the details page of a selected gift.
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };




    return (
        <div className="container-fluid mt-5">
            <div className="row">
                {/* Left side - Filters */}
                <div className="col-md-4 col-lg-3">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Task 3: Dynamically generate category and condition dropdown options.*/}
                            <div className="mb-3">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    id="category"
                                    className="form-select"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="condition" className="form-label">Condition</label>
                                <select
                                    id="condition"
                                    className="form-select"
                                    value={selectedCondition}
                                    onChange={(e) => setSelectedCondition(e.target.value)}
                                >
                                    <option value="">All Conditions</option>
                                    {conditions.map((condition, index) => (
                                        <option key={index} value={condition}>{condition}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Task 4: Implement an age range slider and display the selected value. */}
                            <div className="mb-3">
                                <label htmlFor="ageRange" className="form-label">
                                    Age (Years): Less than {ageRange} years
                                </label>
                                <input
                                    type="range"
                                    className="form-range"
                                    id="ageRange"
                                    min="1"
                                    max="10"
                                    value={ageRange}
                                    onChange={(e) => setAgeRange(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Task 7: Add text input field for search criteria*/}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search for gifts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Task 8: Implement search button with onClick event to trigger search:*/}
                        <button className="btn btn-primary w-100" onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                </div>

                {/* Right side - Search Results */}
                <div className="col-md-8 col-lg-9">
                    <h5 className="mb-3">Search Results</h5>
                    {/*Task 5: Display search results and handle empty results with a message. */}
                    <div className="search-results">
                        {searchResults.length === 0 ? (
                            <div className="alert alert-info text-center">
                                No results found. Try adjusting your search criteria.
                            </div>
                        ) : (
                            <div className="row">
                                {searchResults.map((gift) => (
                                    <div key={gift.id} className="col-md-6 col-lg-4 mb-3">
                                        <div className="card h-100" onClick={() => goToDetailsPage(gift.id)} style={{ cursor: 'pointer' }}>
                                            <div className="card-body">
                                                <h5 className="card-title">{gift.name}</h5>
                                                <p className="card-text">
                                                    <strong>Category:</strong> {gift.category}<br />
                                                    <strong>Condition:</strong> {gift.condition}
                                                </p>
                                                {gift.description && (
                                                    <p className="card-text text-muted">{gift.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
