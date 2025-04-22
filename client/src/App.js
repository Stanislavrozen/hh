import { useEffect, useState } from "react";
import Header from "./header/header";
import List from "./vacancyList/list";
import { begSource, begStream } from "./begSource";
import VacancyEntities from "./vacancyEntities/vacancyEntities";

function App()
{
  const apiBaseUrl = 'https://hh.rozen.pro/api'
  const [grabbed, setGrabbed] = useState([]);
  const [user, setUser] = useState(null)
  const [vacancies, setVacancies] = useState({})
  const [negotiations, setNegotiations] = useState([])
  const [selectedVacancy, setSelectedVacancy] = useState(null)

  async function getVacancies(text)
  {
    const url = `${apiBaseUrl}/getAllVacancies/?text=${text}`

    const vacanciesResponse = await begStream(url)
    const reader = vacanciesResponse.body.getReader()
    const decoder = new TextDecoder()

    let buffer = '';
    let done = false

    while (!done)
    {
      const chunk = await reader.read()
      done = chunk.done

      if (chunk.value)
      {
        buffer += decoder.decode(chunk.value, { stream: true })

        const lines = buffer.split('\n');
        buffer = lines.pop()

        for (const line of lines)
        {
          try
          {

            if (!line.trim()) continue
            const json = JSON.parse(line)
            console.log(json.length != undefined)
            console.log(json)
          } catch (err)
          {
            console.log(err)
          }
        }

      }
    }
    if (buffer.trim())
    {
      try
      {
        const json = JSON.parse(buffer);
        console.log(typeof json);
        console.log(json);
      } catch (err)
      {
        console.warn('Не удалось распарсить финальный кусок:', buffer, err);
      }
    }

  }

  async function getNegotiations(user)
  {
    // const url = user['negotiations_url'].replace(providerApiUrl, rozenProxyUrl)

    const json = await fetch(`${apiBaseUrl}/negotiations`).then(data => data.json()).then(json => json)
    console.log(json)
    setNegotiations(json)
  }

  async function getUser()
  {
    try
    {
      const response = await fetch(`${apiBaseUrl}/me`)
      const json = await response.json();
      console.log(json)

      if (!json.errors?.length)
      {
        setUser(json);
        getNegotiations(json)
      }

    } catch (error)
    {
      console.error("Ошибка получения данных пользователя:", error);
    }
  }

  useEffect(() =>
  {
    // Функция-обработчик для события "message"
    const handleMessage = (event) =>
    {
      if (event.origin !== window.location.origin || event.source.name !== 'oauth') return;
      if (event.data.auth)
      {
        getUser();
      }
    };

    window.addEventListener("message", handleMessage);

    if (!user)
    {
      getUser();
    }

    getVacancies("javascript")

    return () =>
    {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  function selectVacancy(vacancyId)
  {
    console.log(vacancyId)
    // setSelectedVacancy()
  }


  return (
    <div className="App">
      <Header grabbed={grabbed} vacancies={vacancies} getVacancies={getVacancies} user={user} />
      {
        <div className='main'>
          <div className="left-pane"></div>
          <div className='content-area'>
            {/* <div className='scroll-block'>
            </div> */}
            {/* {<Aside data={data} setData={setData} token={token} />} */}
            {
              vacancies.items?.length ? <List vacancies={vacancies} getVacancies={getVacancies} selectVacancy={selectVacancy} /> : null
            }
          </div>
        </div>
      }
    </div>
  );
}

export default App;
