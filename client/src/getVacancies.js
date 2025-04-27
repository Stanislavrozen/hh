import { begStream } from './begSource.js';

export async function getVacancies(text, apiBaseUrl = 'https://hh.rozen.pro/api')
{
    const url = `${apiBaseUrl}/getAllVacancies/?text=${encodeURIComponent(text)}`;
    const result = await begStream(url);
    const reader = result.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';
    let meta = null;
    const items = [];

    /* читаем поток построчно */
    for (let chunk = await reader.read(); !chunk.done; chunk = await reader.read())
    {
        if (!chunk.value) continue;
        buffer += decoder.decode(chunk.value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop();                       // хвост неполной строки

        for (const line of lines)
        {
            if (!line.trim()) continue;
            const json = JSON.parse(line);

            if (!meta)
            {                  // первая строка – это meta-объект
                meta = json;                // { found, pages, clusters… }
            } else
            {                      // все остальные – массивы вакансий
                items.push(...json);        // json гарантированно Array
            }
        }
    }

    /* обрабатываем хвост, если он содержит массив */
    if (buffer.trim())
    {
        items.push(...JSON.parse(buffer));
    }

    return { ...meta, items };
}