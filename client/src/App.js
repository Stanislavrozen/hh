import { useEffect, useState } from "react";
import Header from "./header/header";
import List from "./vacancyList/list";
import { begSource, begStream } from "./begSource";
import VacancyEntities from "./vacancyEntities/vacancyEntities";
import Menu from "./menu/menu";
import { getVacancies } from "./getVacancies";
import { useVacancies } from "./hooks/useVacancies";

function App()
{
  const apiBaseUrl = 'https://hh.rozen.pro/api'
  const [searchText, setSearchText] = useState('javascript');
  const [user, setUser] = useState(null)
  const [negotiations, setNegotiations] = useState([])
  const [selectedVacancy, setSelectedVacancy] = useState(null)
  
  const { vacancies, loading, error } = useVacancies(searchText);

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
      <Header vacancies={vacancies} user={user} initialSearchText={searchText} setSearchText={setSearchText} />
      <Menu />
      {
        <div className='main'>
          <div className="left-pane"></div>
          <div className='content-area'>
            {/* <div className='scroll-block'>
            </div> */}
            {/* {<Aside data={data} setData={setData} token={token} />} */}
            {
              vacancies.items?.length ? <List vacancies={vacancies}  /> : null
            }
          </div>
        </div>
      }
    </div>
  );
}

export default App;
