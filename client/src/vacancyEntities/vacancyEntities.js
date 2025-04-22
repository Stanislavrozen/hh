import React from 'react'
import Item from '../vacancyList/item'

const VacancyEntities = ({ vacancy }) =>
{
    return (
        <>
            {
                vacancy ? <Item vacancy={vacancy} /> : null
            }
        </>
    )
}

export default VacancyEntities