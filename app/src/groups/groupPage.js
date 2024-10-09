import './groupPage.css';
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Groups () {

    const [group, setGroup] = useState('')
    const [groupList, setGroupList] = useState([])
    const[query, setQuery] = useState('')


    // creates new group
    //also needs user id and bool value
    const addGroup = async () => {

        console.log(group)
        try{
            if (group.trim() !== '') {
                setGroupList([...groupList, group]);
                const response = await fetch('/', {
                    method:"POST",
                    body: JSON.stringify({group}),
                    headers: {"Content-Type": "application/json"} 
            
                })
                setGroup('');
                console.log(response)
            }
        }
        catch{
            console.log("error")
        }

        
   }

   //searches all avaliable groups
   const searchGroup = async () => {

        console.log(query)
        setQuery('')

   }

   //if the user has joined a group, a button to leave should appear that calls this function
   //removes logged in user from group
   const leaveGroup = async () => {

    const response = await fetch('/', {
        method:"DELETE",
        body: JSON.stringify({group}),
        headers: {"Content-Type": "application/json"} 

    })

        console.log("leave group")

   }

   //if the logged in user created a group, a button should appear that calls this function
   //deletes entire group collection
   const deleteGroup = async () => {

        const response = await fetch('/', {
            method:"DELETE",
            body: JSON.stringify({group}),
            headers: {"Content-Type": "application/json"} 

        })

   }

return (

    <div>

    <div className='links'>
        <Link to="Home" className='link-padding'>Home</Link>
        <Link to="Leaderboard" className='link-padding'>Leaderboards</Link>
        
    </div>

    <div className="App-header" id="list-container">
        <div>
        <input name="searchGroup" type="text" id="search-input" placeholder="Search existing groups" value={query}  onChange={(e) => setQuery(e.target.value)} />
        <button id="search-button" onClick={searchGroup}>Search</button>
        <input name="newGroup" type="text" id="new-item-input" placeholder="Enter a new item" value={group}  onChange={(e) => setGroup(e.target.value)} />
        <button id="create-button" onClick={addGroup}>Create</button>
        </div>
        <ul>
            {groupList.map((group, index) => (
            <li className="dynamic-list" key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>{group}
            
            <button className>Join</button>

            </li>
            ))}
        </ul>
    </div>
    </div>
);

}

export default Groups;
