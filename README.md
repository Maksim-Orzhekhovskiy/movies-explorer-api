# movies-explorer-api
Бекэнд дипломного проекта.

URL: api.diploma.films.nomoredomains.rocks
IP: 130.193.50.169

Репозиторий проекта: https://github.com/Maksim-Orzhekhovskiy/movies-explorer-api/tree/level-1

## Доступные запросы

* POST /signup  
создаёт пользователя с переданными в теле данными

* POST /signin  
проверяет переданные в теле данные и возвращает JWT

* POST /signout  
JWT удаляется из cookies

* GET /users/me  
возвращает информацию о пользователе

* PATCH /users/me  
обновляет информацию о пользователе

* GET /movies  
возвращает все сохранённые текущим  пользователем фильмы
 
* POST /movies  
создаёт фильм с переданными в теле данными

* DELETE /movies/_id  
удаляет сохранённый фильм по id
