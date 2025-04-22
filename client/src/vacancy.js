import { begSource } from './begSource'
import { setVacancies } from './App'


async function getTree(node)
{
    node.urls = new Array(node.pages).fill(node.url).map((url, idx) => url + "&page=" + idx)

    for (let i = node.page + 1; i < node.pages; i++)
    {
        await node.items.push(...(await begSource(node.urls[i])).items)
    }

    if (node.found && node.found > node.items.length)
    {
        for (let ci = 0; ci < node.clusters.length; ci++)
        {

            const cluster = node.clusters[ci] // Area

            for (let ii = 0; ii < cluster.items.length; ii++)
            {
                cluster.items[ii] = { ...cluster.items[ii], ...await begSource(cluster.items[ii].url + "&page=0") } // Moscow
                getTree(cluster.items[ii])
            }
            console.log(cluster)
        }
    }
    console.log(node)
}