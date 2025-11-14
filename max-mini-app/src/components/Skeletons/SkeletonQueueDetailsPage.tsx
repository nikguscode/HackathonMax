import React from 'react';
import { Container, Flex } from '@maxhub/max-ui';
import Logo from '../Logo';

interface SkeletonBlockProps {
    width: string;
    height: string;
    borderRadius?: string;
    marginBottom?: string;
}

const SkeletonBlock: React.FC<SkeletonBlockProps> = ({ width, height, borderRadius = '12px', marginBottom = '12px' }) => {
    const baseColor = "#EFEFEF"; // Цвет фона для скелетных элементов
    const highlightColor = "#F7F7F7"; // Более светлый цвет для анимации

    return (
        <div 
            style={{
                width,
                height,
                borderRadius,
                marginBottom,
                backgroundColor: baseColor,
                overflow: 'hidden',
                position: 'relative',
                transform: 'translateZ(0)',
            }}
        >
            {/* Анимационный слой (Shimmer effect) */}
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    // Зависит от вашего CSS, но используем inline для примера
                    backgroundImage: `linear-gradient(90deg, ${baseColor} 0px, ${highlightColor} 40px, ${baseColor} 80px)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite linear',
                }}
            />
        </div>
    );
};


const QueueDetailsSkeleton: React.FC = () => {
    // Размеры InfoCard из исходного кода
    const cardWidth = '300px'; 
    const cardHeight = '50px'; 
    const cardMarginBottom = '12px';

    return (
        <Container
            style={{
                backgroundColor: '#FFFFFF',
                minHeight: '100vh',
                padding: '0',
            }}
        >
            <Logo />
            
            <Flex direction="column" align="center" justify="center" style={{ width: '100%' }}>
                <Flex direction="column" align="center" justify="center" style={{ width: 'auto', minWidth: cardWidth }}>
                    {/* Имитация 4x InfoCard */}
                    <SkeletonBlock 
                        width={cardWidth} 
                        height={cardHeight} 
                        marginBottom={cardMarginBottom} 
                    />
                    <SkeletonBlock 
                        width={cardWidth} 
                        height={cardHeight} 
                        marginBottom={cardMarginBottom} 
                    />
                    <SkeletonBlock 
                        width={cardWidth} 
                        height={cardHeight} 
                        marginBottom={cardMarginBottom} 
                    />
                    <SkeletonBlock 
                        width={cardWidth} 
                        height={cardHeight} 
                        marginBottom={cardMarginBottom} 
                    />
                </Flex>

                {/* Имитация QR-кода */}
                <Flex justify="center" align="center" style={{ marginBottom: '24px', marginTop: '24px' }}>
                    <SkeletonBlock
                        width="250px"
                        height="250px"
                        borderRadius="12px"
                    />
                </Flex>
                
                {/* Имитация кнопки "Выйти из очереди" */}
                <Flex align="center" justify="center" style={{ marginBottom: '12px' }}>
                    <SkeletonBlock
                        width="300px" // minWidth: '300px'
                        height="48px" // padding: '12px 16px' -> общая высота
                        borderRadius="16px" 
                    />
                </Flex>
            </Flex>
        </Container>
    );
};

export default QueueDetailsSkeleton;