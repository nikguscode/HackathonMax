import { Flex } from "@maxhub/max-ui";


const SkeletonCard: React.FC = () => {
  const baseColor = "#EFEFEF"; // Цвет фона для скелетных элементов
  const highlightColor = "#F7F7F7"; // Более светлый цвет для анимации

  // Используем стили OrganizationCard для контейнера
  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        width: "100%",
        padding: "12px 16px",
        backgroundColor: "#FFFFFF",
        border: "0.3px solid rgba(0, 0, 0, 0.15)",
        borderRadius: "0px", // Как в OrganizationCard
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // defaultShadow
        marginBottom: "12px", // Как в OrganizationCard
        
        // Добавляем анимацию "мерцания"
        overflow: 'hidden',
        position: 'relative',
        transform: 'translateZ(0)', // Для оптимизации GPU
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
          backgroundImage: `linear-gradient(90deg, ${baseColor} 0px, ${highlightColor} 40px, ${baseColor} 80px)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear',
        }}
      />
      
      {/* Имитация заголовка (Name) */}
      <div
        style={{
          backgroundColor: baseColor,
          height: "15px", // Размер шрифта 15px
          width: "55%",
          borderRadius: "4px",
          zIndex: 1, // Поверх анимационного слоя
        }}
      />

      {/* Имитация счетчика (AmountOfQueues) */}
      <div
        style={{
          backgroundColor: baseColor,
          color: "#FFFFFF",
          padding: "4px 12px",
          borderRadius: "0px",
          height: "15px", 
          minWidth: "20px",
          textAlign: "center",
          marginLeft: "3%",
          zIndex: 1,
        }}
      />
    </Flex>
  );
};

export default SkeletonCard;