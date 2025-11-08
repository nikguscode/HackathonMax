FROM eclipse-temurin:21.0.8_9-jdk-jammy AS builder

WORKDIR /opt/app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY ./src ./src
COPY target/generated-sources/jooq /opt/app/target/generated-sources/jooq
RUN ./mvnw -DskipTests install

FROM eclipse-temurin:21-jre-alpine AS final
WORKDIR /opt/app
EXPOSE 8081
COPY --from=builder /opt/app/target/*.jar /opt/app/*.jar
ENTRYPOINT ["java", "-jar", "/opt/app/*.jar"]