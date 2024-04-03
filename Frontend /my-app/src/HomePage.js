import React from 'react';
import './HomePage.css';
// Import the image
import VisionImage from './e76fa0_527d38bfc07d4d6690601ef4d1b56bec.jpeg';

const HomePage = () => {
    return (
        <main className="homepage">
            <h1>Welcome to Our Clockin DApp</h1>
            <p>Clockin is a decentralized application (dApp) that integrates blockchain technology and smart contracts to manage employee hours.</p>
            <section className="vision-section">
                <div className="vision-image">
                    {/* Use the imported image */}
                    <img src={VisionImage} alt="Vision" />
                </div>
                <div className="vision-text">
                    <h2>Our Vision</h2>
                    <p>We envision a future where small businesses can leverage the power of blockchain technology, smart contracts and Distributed databases to simplify employee time tracking. Our goal is to create a user-friendly, secure, and efficient system that can be set up in less than 5 minutes. This quick and cost-effective setup fosters transparency and trust, enabling small businesses to focus more on growth and productivity without worrying about excessive costs. We aspire to set a new industry standard and inspire a movement towards digital transformation in small businesses worldwide. Get in touch today to learn more about our innovative and cost-effective solution.</p>
                </div>
            </section>
        </main>
    );
}

export default HomePage;
