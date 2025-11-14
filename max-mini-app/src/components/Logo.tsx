import React from 'react';
import logo from '/logo.jpg';
// Предполагаю, что Flex импортируется корректно из @maxhub/max-ui
import { Flex } from '@maxhub/max-ui'; 

interface LogoProps {
    /** Функция обратного вызова при нажатии на кнопку "Назад". 
     * Если не передана, кнопка не отображается. */
    onBack?: () => void;
}

const Logo: React.FC<LogoProps> = ({ onBack }) => {
    return (
        // Используем класс для контейнера
        <Flex
            justify="center"
            align="center"
            className="header-flex-container" 
            style={{
                // Базовые стили для позиционирования
                padding: onBack ? '12px 0' : '16px 0', 
                position: 'relative',
                width: '100%',
            }}
        >
            {/* КНОПКА НАЗАД (Отображается только если передан onBack) */}
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
                    {/* Иконка стрелки влево (SVG) */}
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

            {/* ЦЕНТРИРОВАННЫЙ ЛОГОТИП */}
            <img
                src={logo}
                alt="Логотип"
                // Добавляем класс для адаптивного изменения размера
                className="adaptive-logo-img" 
                style={{
                    height: 'auto',
                    objectFit: 'contain',
                    // Дополнительный отступ для предотвращения перекрытия кнопкой
                    padding: '0 40px', 
                }}
            />
        </Flex>
    );
}

export default Logo;