import React from 'react';
import logo from '/logo.jpg';
import { useNavigate } from 'react-router-dom';
import { Flex } from '@maxhub/max-ui'; 

interface LogoProps {
    onBack?: () => void;
    alwaysLinkToHome?: boolean; 
}

const Logo: React.FC<LogoProps> = ({ onBack, alwaysLinkToHome = true }) => {

    const navigate = useNavigate();
    
    const isLogoClickable = alwaysLinkToHome;

    const containerPadding = onBack ? '12px 0' : '16px 0';

    const handleLogoNavigation = () => {
        if (isLogoClickable) {
            navigate('/'); 
        }
    };

    return (
        <Flex
            justify="center"
            align="center"
            className="header-flex-container" 
            style={{
                padding: containerPadding, 
                position: 'relative',
                width: '100%',
            }}
        >
            {onBack && (
                <button
                    onClick={onBack}
                    style={{
                        position: 'absolute',
                        left: '16px', 
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0',
                        zIndex: 10,
                        minWidth: '40px', 
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#333333" 
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            )}

            <div
                onClick={handleLogoNavigation}
                style={{ 
                    cursor: isLogoClickable ? 'pointer' : 'default',
                    display: 'flex',
                    textDecoration: 'none' 
                }}
            >
                <img
                    src={logo}
                    alt="Логотип"
                    className="adaptive-logo-img" 
                    style={{
                        height: 'auto',
                        objectFit: 'contain',
                        padding: '0 40px',
                    }}
                />
            </div>
        </Flex>
    );
}

export default Logo;