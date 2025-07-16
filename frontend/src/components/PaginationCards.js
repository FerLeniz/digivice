import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './PaginationCards.css'

function Pagination({ totalPages, page, setPage }) {
    const [startPage, setStartPage] = useState(1);

    useEffect(() => {
        let newStartPage = Math.floor((page - 1) / 5) * 5 + 1;
        setStartPage(newStartPage);
    }, [page]);

    const handlePrevious = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNext = () => {

        console.log("CHECK PAGE Y TOTAL: ", page )
        console.log('TOTAL: ',totalPages)
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    return (
        <div className="number-pagination">
            <ArrowLeft
                className={`arrow-icon ${page === 1 ? 'dissapear' : ''}`}
                size={45}
                onClick={handlePrevious}
            />
            {Array.from({ length: Math.min(5, totalPages - startPage + 1) }, (_, i) => startPage + i).map((num) => (
                <button
                    key={num}
                    className={num === page ? 'active' : ''}
                    onClick={() => setPage(num)}
                >
                    {num}
                </button>
            ))}
            <ArrowRight
                className={`arrow-icon ${page === totalPages || totalPages === 0 ? 'dissapear' : ''}`}
                size={45}
                onClick={handleNext}
            />
        </div>
    );
}

export default Pagination;
