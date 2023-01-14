# RSS Reader
Сервис для агрегации RSS-потоков, с помощью которых удобно читать разнообразные источники, например, блоги. Он позволяет добавлять неограниченное количество RSS-лент, сам их обновляет и добавляет новые записи в общий поток.

[![Actions Status](https://github.com/tarasovem/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/tarasovem/frontend-project-11/actions)
[![project-check](https://github.com/tarasovem/frontend-project-11/actions/workflows/project-check.yml/badge.svg)](https://github.com/tarasovem/frontend-project-11/actions/workflows/project-check.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/72909a802f0d09da2599/maintainability)](https://codeclimate.com/github/tarasovem/frontend-project-11/maintainability)

[Preview](https://frontend-project-11-tarasovem.vercel.app/)

## Минимальные требования
- Node.js
- npm

## Установка
Для установки сервиса необходимо в папке проекта открыть терминал и ввести следующую команду:
```bash
make install
```

Теперь, когда вы установили все необходимые зависимости, можете собрать проект командой
```bash
make build
```
А так же запустить проект в режиме разработки, после чего проект соберется и запустится локальный сервер
```bash
make dev
```

## Использование
После того как вы откроете страницу проекта перед вами появится поле ввода.
1. Введите адрес RSS-ленты
2. Нажмите кнопку "Добавить"
3. Слева появится список постов, полученных из добавленного фида
4. Справа список подключенных фидов
5. Список постов будет пополняться каждый раз, при обновлении фида
6. При нажатии кнопки "Просмотр" откроется модальное окно с предложением перейти к целевой статье или посту
7. Так же к статье или посту можно перейти просто нажав на заголовок
8. Все просмотренные статьи будут иметь серый цвет