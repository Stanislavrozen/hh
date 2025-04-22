Реализовано прокси API через собственный сервер до api.hh.ru
Реализован OAUTH поток с индикацией наличия авторизации
Реализовано собственное API для расширения функционала (например, получения сразу всех элементов без пейджинга)

В целом:
СЕРВЕР - Node с модулями cors dotenv ejs express express-session pg pg-hstore sequelize nodemon, три роута на proxy, oauth и свой RESTapi
КЛИЕНТ - React
БАЗА - Postgres
ИНФРАСТРУКТУРА - 2 контейнера: 1. Nginx в качестве reverse 2. Node с express раздающим статику из того же контейнера

Приблуда:
1. Meta LLaMA 3.1 8B Instruct не модифицированная полноразмерная на 3090Ti
2. Python окружение venv. Создано виртуальное окружение внутри WebUI.
В него установлен: transformers torch (с поддержкой CUDA 11.8) accelerate huggingface_hub
Это позволяет: писать свои скрипты (llama_test.py) напрямую обращаться к LLaMA без webui
3. Инференс - PyTorch + Transformers + text-generation-webui
