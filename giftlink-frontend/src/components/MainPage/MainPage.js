import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Task 1: Write async fetch operation
        // Write your code below this line
        const fetchGifts = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts`);
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.error('Error fetching gifts:', error);
            }
        };
        fetchGifts();
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        // Write your code below this line
        navigate(`/app/product/${productId}`);
    };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        // Write your code below this line
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">

                            {/* // Task 4: Display gift image or placeholder */}
                            {/* // Write your code below this line */}
                            {gift.image ? (
                                <img src={gift.image} alt={gift.name} className="card-img-top" />
                            ) : (
                                <div className="card-img-top placeholder-img">No Image</div>
                            )}

                            <div className="card-body">

                                {/* // Task 5: Display gift name */}
                                {/* // Write your code below this line */}
                                <h5 className="card-title">{gift.name}</h5>

                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                    {gift.condition}
                                </p>

                                {/* // Task 6: Display the formatted date */}
                                {/* // Write your code below this line */}
                                <p className="card-text text-muted">
                                    Added: {formatDate(gift.date_added)}
                                </p>


                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
