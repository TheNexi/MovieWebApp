# MovieWebApp
Porównanie wybranych frameworków - React vs Angular

## Uruchamianie Backendu (Spring Boot) przez Docker Compose

**Wymagania:**
* Docker Desktop

W terminalu Git Bash (z poziomu głównego folderu projektu):

```bash
cd MovieWebApp/Backend/moviewebapp
docker stop $(docker ps -aq); docker rm $(docker ps -aq)
docker system prune -a
docker compose up --build --force-recreate
```

## Dokumentacja Swagger (Backend)
```bash
http://localhost:8080/swagger-ui/index.html
```

## Uruchamianie Frontendu Angular

W terminalu Git Bash (z poziomu głównego folderu projektu):

```bash
cd MovieWebApp/Frontend/Angular
npm install
npm start
```

## Uruchamianie Frontendu React

W terminalu Git Bash (z poziomu głównego folderu projektu):

```bash
cd MovieWebApp/Frontend/React/movie-app
npm install
npm run dev
```

## React
<img width="1918" height="975" alt="image" src="https://github.com/user-attachments/assets/b14d9c53-9501-4975-ac9f-40cec6c39ad3" />


## Angular
<img width="1914" height="1136" alt="image" src="https://github.com/user-attachments/assets/966dfee6-fd68-4919-a92c-239681319452" />
