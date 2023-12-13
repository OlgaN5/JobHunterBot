       const startOptions = {
           reply_markup: JSON.stringify({
               keyboard: [
                   [{
                       text: 'Продолжить поиск',
                       resize_keyboard: true,
                   }, {
                       text: 'Начать поиск',
                       resize_keyboard: true,
                   }, {
                       text: 'Установить резюме для отклика',
                       resize_keyboard: true,
                   }, {
                       text: 'Написать письмо для отклика',
                       resize_keyboard: true,
                   }],
               ],
               resize_keyboard: true,
           })
       }
       const startSearchOptions = {
           reply_markup: JSON.stringify({
               keyboard: [
                   [{
                       text: 'Получить первую вакансию',
                       resize_keyboard: true,
                   }, {
                       text: 'Добавить фильтр',
                       resize_keyboard: true,
                   }],
               ],
               resize_keyboard: true,
           })
       }
       const filterOptions = {
           reply_markup: JSON.stringify({
               keyboard: [
                   [{
                           text: 'Город',
                           resize_keyboard: true,
                       },
                       //    {
                       //        text: 'Заработная плата',
                       //        resize_keyboard: true,
                       //    }, 
                       {
                           text: 'Опыт',
                           resize_keyboard: true,
                       }
                   ],
               ],
               resize_keyboard: true,
           })
       }
       const mainOptions = {
           reply_markup: JSON.stringify({
               keyboard: [
                   //    [{
                   //        text: 'Сбросить фильтры',
                   //        resize_keyboard: true,
                   //        //    callback_data: 'resetFilters'
                   //    }, {
                   //        text: 'Добавить фильтр',
                   //        resize_keyboard: true,
                   //        //    callback_data: 'addFilters'
                   //    }],
                   //    [{
                   //        text: 'Новый запрос',
                   //        resize_keyboard: true,
                   //        //    callback_data: 'newQuery'
                   //    }],
                   [{
                           text: 'Первая вакансия',
                           resize_keyboard: true,
                           //    callback_data: 'firstVacancy',
                       },
                       {
                           text: 'Назад',
                           resize_keyboard: true,
                           //    callback_data: 'nextVacancy',
                       },
                       {
                           text: 'Вперед',
                           resize_keyboard: true,
                           //    callback_data: 'nextVacancy',
                       },
                       {
                           text: 'Откликнуться',
                           resize_keyboard: true,
                           //    callback_data: 'nextVacancy',
                       },
                       //    {
                       //        text: 'Предыдущая вакансия',
                       //        resize_keyboard: true,
                       //        //    callback_data: 'prevVacancy',
                       //    }
                   ]

               ],
               resize_keyboard: true,
           }),
           parse_mode: 'MarkdownV2'
       }
       const experienceOptions = {
           reply_markup: JSON.stringify({
               keyboard: [
                   [{
                       text: 'Без опыта',
                       resize_keyboard: true,
                       //    callback_data: 'noExperience'
                   }, {
                       text: 'От 1 до 3 лет',
                       resize_keyboard: true,
                       //    callback_data: 'experienceBetween1And3'
                   }, {
                       text: 'От 3 до 6 лет',
                       resize_keyboard: true,
                       //    callback_data: 'experienceBetween3And6'
                   }, {
                       text: 'Более 6 лет>',
                       resize_keyboard: true,
                       //    callback_data: 'experienceMoreThan6'
                   }]
               ],
               resize_keyboard: true,
           })
       }
       const currencyOptions = {
           reply_markup: JSON.stringify({
               inline_keyboard: [
                   [{
                           text: 'BYN',
                           resize_keyboard: true,
                           //    callback_data: 'currencyByn'
                       }, {
                           text: 'RUB',
                           //    callback_data: 'currencyRub'
                           resize_keyboard: true,
                       },
                       {
                           text: 'USD',
                           resize_keyboard: true,
                           //    callback_data: 'currencyUsd'
                       }
                   ]
               ],
               resize_keyboard: true,
           })
       }

       module.exports = {
           startOptions,
           mainOptions,
           filterOptions,
           currencyOptions,
           startSearchOptions
       }