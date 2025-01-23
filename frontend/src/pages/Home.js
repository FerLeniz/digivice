import React, { useState, useEffect } from 'react';
import './Home.css'; // Import the CSS file for styling
import MenuBar from '../components/MenuBar';

function Home() {
    const [digimon, setDigimon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);

    // Fetch Digimon data from the API
    useEffect(() => {
        const fetchDigimon = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://digi-api.com/api/v1/digimon?page=${page}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setDigimon(data.content); // Assuming `data.content` contains the list of Digimon
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchDigimon();
    }, [page]);

    // Handle Previous and Next button clicks
    const handlePrevious = () => {
        if (page > 0) {
            setPage(page - 1); // Decrement page, ensuring it doesn't go below 0
        }
    };

    const handleNext = () => {
        setPage(page + 1); // Increment page
    };

    if (loading) {
        return <div className="home-container">Loading...</div>;
    }

    if (error) {
        return <div className="home-container">Error: {error}</div>;
    }

    return (
        <>
            <MenuBar />
            <div className="home-container">
                <h2 className="title">Search info about Digimon</h2>
                <div className="search-container">
                    <button onClick={handlePrevious} disabled={page === 0}>
                        Previous
                    </button>
                    <button onClick={handleNext}>
                        Next
                    </button>
                </div>
                <div className="digimon-list">
                    {digimon.map((digi) => (
                        <div key={digi.id} className="digimon-card">
                            <div className="card">
                                <div className="card-header">{digi.name}</div>
                                <div className="card-image">
                                    <img src={digi.image} alt={digi.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="card-stats">
                                    <div>Level: {digi.level}</div>
                                    <div>Attribute: {digi.attribute}</div>
                                </div>
                                <div className="card-footer">Type: {digi.type}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
}

export default Home;
