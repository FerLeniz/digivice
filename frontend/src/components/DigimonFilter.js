import React, { useState, useEffect } from "react";
import axios from "axios";
import './DigimonFilter.css';

const DigimonFilter = ({ onFilterChange }) => {
    const [levels, setLevels] = useState([]);
    const [types, setTypes] = useState([]);
    const [attributes, setAttributes] = useState([]);

    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedAttribute, setSelectedAttribute] = useState("");

    // Fetch filter options from backend
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/getFilterDropdown");
                setLevels(response.data.levels);
                setTypes(response.data.types);
                setAttributes(response.data.attributes);
            } catch (error) {
                console.error("Error fetching filter data:", error);
            }
        };

        fetchFilters();
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === "Enter") {
                onFilterChange({ level: selectedLevel, type: selectedType, attribute: selectedAttribute });
            }
        };

        window.addEventListener("keypress", handleKeyPress);
        return () => {
            window.removeEventListener("keypress", handleKeyPress);
        };
    }, [selectedLevel, selectedType, selectedAttribute, onFilterChange]);

    return (
        <div className="filter-container">
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                <option value="">All Levels</option>
                {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                ))}
            </select>

            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="">All Types</option>
                {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                ))}
            </select>

            <select value={selectedAttribute} onChange={(e) => setSelectedAttribute(e.target.value)}>
                <option value="">All Attributes</option>
                {attributes.map((attr) => (
                    <option key={attr} value={attr}>{attr}</option>
                ))}
            </select>

            <button onClick={() => onFilterChange({ level: selectedLevel, type: selectedType, attribute: selectedAttribute })}>
                Apply Filters
            </button>
        </div>
    );
};

export default DigimonFilter;
