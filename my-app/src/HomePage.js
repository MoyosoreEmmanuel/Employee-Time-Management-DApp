import React from 'react';
import './HomePage.css'; // Make sure to update this CSS file with new styles
import VisionImage from './Designer (1).jpeg';

const HomePage = () => {
    return (
        <div className="homepage">
            <header className="hero">
                <div className="hero-content">
                    <h1>Welcome to Our Employee Work Time Management DApp</h1>
                    <p>Our system is a decentralized application (dApp) that integrates blockchain technology, smart contracts and React to manage employee hours. Harnessing the power of  the Ethereum Blockchain, it provides a simple interface for employees to log their hours and for employers to access and review these records. The system also includes features for payroll management.
                     The benefits of our system for small businesses include Time Fraud prevention, efficiency, transparency, security, and cost-effectiveness. The automated process of recording and verifying hours saves time and reduces administrative workload. All transactions are recorded on the blockchain, providing a clear and verifiable record of employee hours. The decentralized nature of blockchain and the use of distributed databases  ensure the security and integrity of the data. As a dApp, our system has minimal setup and maintenance costs, making it an affordable solution for small businesses.</p>
                    <button>Learn More</button>
                </div>
                <div className="hero-image">
                    <img src={VisionImage} alt="Vision" />
                </div>
            </header>

            <section id="vision" className="vision-section">
                <div className="vision-content">
                    <h2>Our Vision</h2>
                    <p>We envision a future where small businesses can leverage the power of blockchain technology and smart contracts to simplify employee time tracking.</p>
                </div>
                <div className="vision-icons">
                    {/* Replace with your own icons and descriptions */}
                    <div className="icon">
                        <i className="fas fa-globe"></i>
                        <p>Complete Coverage</p>
                    </div>
                    <div className="icon">
                        <i className="fas fa-headset"></i>
                        <p>Extensive Support</p>
                    </div>
                    {/* Add more icons as needed */}
                </div>
            </section>

            <footer className="footer">
                <p>© 2024 Clockin DApp</p>
            </footer>
        </div>
    );
}

export default HomePage;
