# JobHunterBot
(eng/rus)

# Contents
- [In English](#english)
- [In Russian](#russian)

</br>

## English

**Description:**

JobHunterBot is an application developed using the Telegram-API (webhook approach), which simplifies the use of the website for job search.

</br>

**The main features and functionality** of the project include:

&bull; Authorization on HeadHunter.ru website via bot
 
&bull; Job search by filters

&bull; Setting default filters

&bull; Response to vacancies (if user authorized)

&bull; Adding an accompanying letter for further use in response

</br>

**Technologies used:** 

    Framework: express
    Work with databases: sequelize, postgress
    Work with Telegram API: node-telegram-bot-api
    Work with API HeadHunter: axios

**The database**

The database schema consists of 2 tables:

    User
    Filters (consists filter info that will be used by default)

There are relationships between the tables:

    Between User и Filters - one-to-many
    


</br>

## Russian

**Описание:**

JobHunterBot - это приложение, разработанное с использованием Telegram-API (подход webhook), которое упрощает взамодействие с сайтом для поиска работы.  

</br>

Основные возможности и функциональность проекта включают в себя:

&bull; Авторизация на сайте HeadHunter.ru через бота
 
&bull; Поиск вакансий по фильтрам

&bull; Установка фильтров по умолчанию для откликов

&bull; Отклик на вакансии (если пользователь авторизован)

&bull; Добавление сопроводительного письма для дальнейшего использования при откликах

</br>

**Использованые технологии:** 

    Фреймворк: express
    Работа с базами данных: sequelize, postgress
    Работа с Telegram API: node-telegram-bot-api
    Работа с API HeadHunter: axios

**База данных**

Схема базы данных состоит из 2-х таблиц: 

    User ( Содержит информацию о пользователях)
    Filters (содержит информацию о фильтрах, используемых по умолчанию)

Между таблицами установлены связи : 

    Между User и Filters - один-к-одному
    






