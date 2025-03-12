import './Home.css';
import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toggleLike } from '../redux/authSlice';
import Card from "../components/DigimonCard";
import DigimonFilter from "../components/DigimonFilter";

function Home() {
    const [digimon, setDigimon] = useState([]);
    const [totalDigimons,setTotalDigimons] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({ level: "", type: "", attribute: "" });

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);
    const likedCards = new Set(user?.likedCards || []);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchDigimon = async () => {
            setLoading(true);
            setError(null);
            try {
                const queryParams = new URLSearchParams({
                    page,
                    ...(filters.level && { level: filters.level }),
                    ...(filters.type && { type: filters.type }),
                    ...(filters.attribute && { attribute: filters.attribute })
                }).toString();

                const response = await fetch(`http://localhost:3001/api/digipage?${queryParams}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setTotalDigimons(data.pageable.totalElements)
                setDigimon(data.content);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchDigimon();
    }, [page, JSON.stringify(filters)]);

    const handlePrevious = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {
        setPage(page + 1);
    };

    const likeFunction = async (cardId) => {
        if (!isAuthenticated) return toast.error('You need to log in 😅');

        try {
            await axios.post(`http://localhost:3001/api/auth/like/${cardId}`, {}, { withCredentials: true });

            dispatch(toggleLike(cardId));

            toast.success(likedCards.has(cardId) ? 'Card unliked successfully!' : 'Card liked successfully!');

        } catch (error) {
            console.error('Error liking card:', error);
            toast.error(error.response?.data?.message || 'Something went wrong!');
        }
    }


    // Function to update filters state
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1)
    };

    if (loading) {
        return <div className="loading-container"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="loading-container"><p>Error: {error}</p></div>;
    }

    return (
        <>
            <MenuBar />
            <div className="home-container">
                <h2 className="title">Discover Your Favorite Digimon & Bring It Home!</h2>
                <h2>Total digimon found: {totalDigimons}</h2>
                <DigimonFilter onFilterChange={handleFilterChange} />
                <div className="digimon-list">
                    {digimon.length > 0 ? (
                        digimon.map((card) => (
                            <Card key={card._id} card={card} isLiked={likedCards.has(card._id)} onLike={likeFunction} />
                        ))
                    ) : (
                        <p className='text-not-found'>No Digimon found.</p>
                    )}
                </div>
                <div className="search-container">
                    <button onClick={handlePrevious} disabled={page === 1}>
                        Previous
                    </button>
                    <button onClick={handleNext} disabled={digimon.length < 10}>
                        Next
                    </button>
                </div>
            </div>
        </>

    );
}

export default Home;
