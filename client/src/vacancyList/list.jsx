import React, { useEffect, useRef, useState } from 'react'
import './list.css'
import Item from './item'
import VacancyEntities from '../vacancyEntities/vacancyEntities'

const List = ({ vacancies, setVacancies }) =>
{
    const [selectedVacancy, setSelectedVacancy] = useState(null)

    useEffect(() =>
    {
        // const elem = document.querySelector(".items-block")
        // let distanceToScroll = elem.scrollHeight - window.document.body.scrollHeight;
        // var speed = 1;

        // const timer = setInterval(function ()
        // {
        //     elem.parentNode.scrollBy(0, speed);

        //     if (distanceToScroll <= 0)
        //     {
        //         clearInterval(timer);
        //     }
        // }, 16);

        // return () => clearInterval(timer)

    }, [])

    // function setAside(vacancy)
    // {
    //     setLanded(landed.map(v =>
    //     {
    //         if (v.id == vacancy.id)
    //         {
    //             if (vacancy.aside == true)
    //             {
    //                 v.aside = false
    //             }
    //             else
    //             {
    //                 v.aside = true
    //             }
    //         }
    //         else
    //         {
    //             v.aside = false
    //         }
    //         return v;
    //     }))
    // }

    function selectVacancy(vacancyId)
    {
        if (vacancyId == selectedVacancy?.id)
        {
            setSelectedVacancy(null)
            console.log(null)
        }
        else
        {
            const newSelection = vacancies.items.find(v => v.id == vacancyId)
            setSelectedVacancy(newSelection)
            console.log(newSelection)
        }
    }

    return (
        <div className='list-block'>
            <div className={selectedVacancy ? "list-pane active" : "list-pane"}>
                {selectedVacancy ? <Item item={selectedVacancy} selectVacancy={selectVacancy} /> : null}
            </div>
            <div className="items-block">
                {
                    vacancies.items?.map((v, idx) =>
                    {
                        return (
                            <Item key={v.id} count={idx} item={v} selectVacancy={selectVacancy} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default List

