import React from 'react';
import './Footer.css'

function Footer() {


    return (
        <div className='footer'>
            <p>© {new Date().getFullYear()} Digi-Commerce | All Rights Reserved </p>
        </div>
    );
}

export default Footer;