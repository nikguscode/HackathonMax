import React from 'react';
import logo from '/logo.jpg';
import { Flex } from '@maxhub/max-ui'; 

interface LogoProps {
    /** Функция обратного вызова при нажатии на кнопку "Назад". 
     * Если не передана, кнопка не отображается. */
    onBack?: () => void;
    /** Если true, логотип всегда является ссылкой на главную страницу (/) */
    alwaysLinkToHome?: boolean; 
}

const Logo: React.FC<LogoProps> = ({ onBack, alwaysLinkToHome = true }) => {
    
    // Определяем, должен ли логотип быть кликабельным (ссылкой)
    const isLogoClickable = alwaysLinkToHome;

    // Компонент, который обернет логотип (либо <a>, либо <div>)
    const LogoWrapper = isLogoClickable ? 'a' : 'div';
    
    // Определяем отступы
    const containerPadding = onBack ? '12px 0' : '16px 0';

    return (
        // Контейнер Flex
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

            {/* ЦЕНТРИРОВАННЫЙ ЛОГОТИП (обернутый в <a>, если isLogoClickable) */}
            <LogoWrapper
                // Если кликабелен, делаем его ссылкой
                {...(isLogoClickable ? { 
                    href: '/', // Ссылка на главную страницу
                    style: { cursor: 'pointer', display: 'flex' } // Добавляем курсор
                } : {})}
            >
                <img
                    src={logo}
                    alt="Логотип"
                    // Добавляем класс для адаптивного изменения размера
                    className="adaptive-logo-img" 
                    style={{
                        height: 'auto',
                        objectFit: 'contain',
                        padding: '0 40px', // Отступ, чтобы не мешать кнопке Назад
                        // Добавляем стиль для предотвращения синего подчеркивания, если это <a>
                        textDecoration: 'none' 
                    }}
                />
            </LogoWrapper>
        </Flex>
    );
}

export default Logo;