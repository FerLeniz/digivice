import './Home.css';
import React, { useState, useEffect } from 'react';
import MenuBar from '../components/MenuBar';
import Footer from '../components/Footer'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toggleLike } from '../redux/authSlice';
import Card from "../components/DigimonCard";
import DigimonFilter from "../components/DigimonFilter";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Pagination from '../components/PaginationCards';

function Home() {


    return (
        <>
            <MenuBar />

            <Footer />
        </>

    );
}

export default Home;