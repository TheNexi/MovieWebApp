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
<img width="1919" height="1139" alt="image" src="https://github.com/user-attachments/assets/eba484d8-ace7-4a32-a946-9e2ef5709e9a" />


## Zdjęcia użyte w projekcie pobrano z open-source https://www.magnific.com/free-photos-vectors/director:

---------------------

You must attribute the image to its author:

In order to use a vector or a part of it, you must attribute it to Kues / Freepik,
so we will be able to continue creating new graphic resources every day.


How to attribute it?

For websites:

Please, copy this code on your website to accredit the author:
<a href="http://www.freepik.com">Designed by Kues / Freepik</a>

For printing:

Paste this text on the final work so the authorship is known.
- For example, in the acknowledgements chapter of a book:
"Designed by Kues / Freepik"


You are free to use this image:

- For both personal and commercial projects and to modify it.
- In a website or presentation template or application or as part of your design.

You are not allowed to:

- Sub-license, resell or rent it.
- Include it in any online or offline archive or database.

The full terms of the license are described in section 7 of the Freepik
terms of use, available online in the following link:

  http://www.freepik.com/terms_of_use

The terms described in the above link have precedence over the terms described
in the present document. In case of disagreement, the Freepik Terms of Use
will prevail.
