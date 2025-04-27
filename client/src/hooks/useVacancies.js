import { useEffect, useState } from 'react';
import { begStream } from '../begSource';

export function useVacancies(searchText)
{
    const [vacancies, setVacancies] = useState({ found: 0, items: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() =>
    {
        if (!searchText) return;
        let ignore = false;

        setLoading(true);
        setError(null);
        setVacancies({ found: 0, items: [] });

        (async () =>
        {
            try
            {
                const res = await begStream(`https://hh.rozen.pro/api/getAllVacancies/?text=${encodeURIComponent(searchText)}`);
                const reader = res.body.getReader();
                const decoder = new TextDecoder();

                let buffer = '';
                let chunk;
                let metaJson = null;

                while (!metaJson)
                {
                    chunk = await reader.read();
                    if (chunk.done) throw new Error('Не пришла meta-строка');
                    buffer += decoder.decode(chunk.value, { stream: true });

                    const lines = buffer.split('\n');
                    if (lines.length < 2) continue;    // нет ещё полной строки

                    const metaLine = lines.shift();
                    metaJson = JSON.parse(metaLine);
                    if (!ignore) setVacancies(metaJson);

                    buffer = lines.join('\n');
                }

                for (chunk = await reader.read(); !chunk.done; chunk = await reader.read())
                {
                    if (!chunk.value) continue;
                    buffer += decoder.decode(chunk.value, { stream: true });

                    const lines = buffer.split('\n');
                    buffer = lines.pop();

                    for (const line of lines)
                    {
                        if (!line.trim()) continue;
                        const json = JSON.parse(line);

                        if (!ignore)
                        {
                            setVacancies(prev => ({ ...prev, items: [...prev.items, ...json] }));
                        }
                    }
                }

                // финальный хвост
                if (buffer.trim())
                {
                    const json = JSON.parse(buffer);
                    if (json.found !== undefined)
                    {
                        if (!ignore) setVacancies(json);
                    } else if (!ignore)
                    {
                        setVacancies(prev => ({ ...prev, items: [...prev.items, ...json] }));
                    }
                }
            } catch (e)
            {
                if (!ignore) setError(e);
            } finally
            {
                if (!ignore) setLoading(false);
            }
        })();

        return () => { ignore = true; };
    }, [searchText]);

    return { vacancies, loading, error };
}