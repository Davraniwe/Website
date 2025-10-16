#!/bin/bash

# Скрипт для обновления социальных сетей в футерах всех HTML файлов

# Находим все HTML файлы
find /root/website/fenomenchess.1010 -name "*.html" -type f | while read file; do
    echo "Обработка: $file"

    # Замена YouTube ссылки (удаление)
    sed -i 's|<a href="#" target="_blank"><i class="fa-brands fa-youtube"></i></a>||g' "$file"

    # Замена VK ссылки
    sed -i 's|<a href="#" target="_blank"><i class="fa-brands fa-vk"></i></a>|<a href="https://vk.com/phenomen_kazan" target="_blank" rel="noopener noreferrer" aria-label="VK"><i class="fa-brands fa-vk"></i></a>|g' "$file"

    # Замена Telegram ссылки
    sed -i 's|<a href="#" target="_blank"><i class="fa-brands fa-telegram"></i></a>|<a href="https://t.me/kazan_fenomen" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><i class="fa-brands fa-telegram"></i></a>|g' "$file"
done

echo "Готово! Все футеры обновлены."
