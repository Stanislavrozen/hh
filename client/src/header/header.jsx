import React, { useEffect, useState } from 'react'
import './header.css'

const Header = ({ vacancies, grabbed, getVacancies, user }) =>
{
    const [total, setTotal] = useState('')
    const [text, setText] = useState("")
    const [show, setShow] = useState(false)
    const headerClass = show ? 'header show' : 'header';
    const searchClass = show ? 'search show' : 'search';
    const apiBaseUrl = 'https://hh.rozen.pro/api'

    function switchShow()
    {
        setShow(show ? false : true)
    }

    // useEffect(() =>
    // {
    //     if (!vacancies.length)
    //     {
    //         getVacancies('javascript')
    //     }
    // }, [])

    function startAuth()
    {
        window.open(`https://hh.rozen.pro/oauth/start/`, 'oauth', "width=500,height=600,top=50,left=50,toolbar=no,menubar=0,location=0,status=0,scrollbars=0")
    }


    return (
        <div className={headerClass}>
            <div className='header-main'>
                <div className='logo' onClick={e => window.location.href = window.location.href}>
                </div>
                <div className='count'>
                    {
                        vacancies.items?.length ? vacancies.items.length + "/" + vacancies.found : <span className='totlal-vacancies'>{total}</span>
                    }
                </div>
                <div className='header-controls'>
                    <button onClick={switchShow}>
                        <svg width="24" height="24" role="img" focusable="false"><path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        Поиск
                    </button>
                    <button onClick={startAuth}>
                        <div className={user?.id ? "user authorized" : "user"} style={{ position: 'relative', width: '24px', height: '24px', display: 'inline-block', }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" focusable="false">
                                <path d="M5.3163 19.4384C5.92462 18.0052 7.34492 17 9 17H15C16.6551 17 18.0754 18.0052 18.6837 19.4384 M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5 C14.2091 5.5 16 7.29086 16 9.5ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12 C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="var(--magritte-ui-icon-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <circle cx="20" cy="4" r="4" fill="rgb(52, 211, 153)" className='status' stroke="white" stroke-width="1" />
                            </svg>
                        </div>
                    </button>
                </div>
            </div>
            <div className={searchClass}>
                <div className='searchline'>
                    <div className='input-block'>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false"><path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#6a7885" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                        <input autoFocus onKeyDown={e => 
                        {
                            e.code == "Enter" && getVacancies(text)
                        }
                        } value={text} onChange={(e) => setText(e.target.value)} placeholder='Профессия, должность или компания' type='text' />
                        <button onClick={() => getVacancies(text)}>Найти</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Header