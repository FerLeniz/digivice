import './Home.css';
import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar';

function Home() {
    const [digimon, setDigimon] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    // Fetch Digimon data from the API
    useEffect(() => {
        const fetchDigimon = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:3001/api/digipage?page=${page}`);
                console.log("pagina es: ", `http://localhost:3001/api/digipage?page=${page}`)
                //http://localhost:3001/api/digipage?page=2
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

    const handlePrevious = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        setPage(page + 1);
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
                <h2 className="title">Discover Your Favorite Digimon & Bring It Home!</h2>
                <div className="search-container">
                    <button onClick={handlePrevious} disabled={page === 1}>
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
                                    <div>Level: {digi.level ? digi.level : "Unknown"}</div>
                                    <div>Attribute: {digi.attribute ? digi.attribute : "Unknown"}</div>
                                </div>
                                <div className="card-footer">Type: {digi.type ? digi.type : "Unknown"}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>

    );
}

export default Home;
