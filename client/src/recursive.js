import { delay } from './delay'

const ready = []
const uniqClusters = []
const uniqNotReady = []

export const vacancies = []

export async function recursive(clusters)
{
    await delay(500)

    const notreadyItems = await separate(clusters)
    console.log('notreadyItems', notreadyItems)

    if (notreadyItems.length)
    {
        for (let i = 0; i < notreadyItems.length; i++)
        {
            const itemData = await fetch(notreadyItems[i].url).then(data => data.json()).then(json => json)

            const subClusters = itemData.clusters
                .map(cluster => { return { ...cluster, parents: [...notreadyItems[i].parents] } })
                .filter(cluster =>
                {
                    const parent = (cluster.id == 'area') ? `${cluster.id}:${notreadyItems[i].name}` : cluster.id
                    return !notreadyItems[i].parents.includes(parent)
                })
            subClusters.forEach(subCluster =>
            {
                subCluster['sum'] = subCluster.items.reduce((acc, cur) => acc + cur.count, 0)
            })
            notreadyItems[i].clusters = subClusters
            await recursive(subClusters)
        }
    }
    else
    {
        return
    }
}

function getParentCluster(clusterId, item)
{
    return clusterId == 'area' ? `${clusterId}=${item.name}` : clusterId
}

function getClusterParams(url)
{
    return new URL(url)
        .searchParams['entries']()
        .toArray()
        .filter(e => e[0] != 'clusters' && e[0] != 'per_page' && e[0] != 'text')
        .map(e => e.join('='))
        .sort((a, b) => a.localeCompare(b))
        .join('&')
}

async function separate(clusters)
{
    const notready = [];

    for (const cluster of clusters)
    {
        for (const item of cluster.items)
        {
            item.parents = [...cluster.parents, getParentCluster(cluster.id, item)];
            item.clusterParams = getClusterParams(item.url);

            if (item.count > 0 && item.count <= 2000)
            {
                if (!uniqClusters.find(u => u.clusterParams === item.clusterParams))
                {
                    uniqClusters.push(item);
                    await getVacancies(item); // загрузка вакансий
                }
            } else if (item.count > 2000)
            {
                if (!uniqNotReady.find(u => u.clusterParams === item.clusterParams))
                {
                    uniqNotReady.push(item);
                    notready.push(item);
                }
            }
        }
    }

    return notready;
}

async function getVacancies(clusterItem)
{
    const urlParsed = new URL(clusterItem.url)
    urlParsed.searchParams.set('clusters', false)
    urlParsed.searchParams.set('per_page', 100)
    urlParsed.searchParams.set('page', 0)
    await delay(300)
    const firstPage = await fetch(urlParsed.toString()).then(data => data.json()).then(json => json);

    addUniqVacancies(firstPage.items)

    for (let i = 1; i < firstPage.pages; i++)
    {
        await delay(300)
        urlParsed.searchParams.set('page', i)
        const page = await fetch(urlParsed.toString()).then(data => data.json()).then(json => json);
        addUniqVacancies(page.items)
        // setLanded(vacancies)
    }
}

function addUniqVacancies(items)
{
    for (let i = 0; i < items.length; i++)
    {
        const vacancy = items[i]
        const exists = !!vacancies.find(v => v.id == vacancy.id)
        if (!exists)
        {
            vacancies.push(vacancy)
        }
    }
}