import React, { useState } from 'react'
import './DetectRegionApp.css'
import Result from '../Result/Result'

import search_icon from '../Assets/search-icon.svg'

const DetectRegionApp = () => {
    const URL = process.env.REACT_APP_API;
    let buttonEnabled = true;
    let buttonDefaultColor;
    let button;
    const [username, setUsername] = useState('');
    const [regions, setRegions] = useState([]);
    const [moreThan3, setMoreThan3] = useState(false);

    const search = () => {
        if (!buttonEnabled) {
            return;
        }

        buttonEnabled = false;

        setRegions([]);

        if (username === '') {
            alert('Please enter an username');
            buttonEnabled = true;
            return;
        }

        if (button === undefined) {
            button = document.getElementsByClassName('search-icon')[0];
            buttonDefaultColor = button.style.backgroundColor;
        }

        button.style.cursor = 'not-allowed';
        button.style.backgroundColor = 'grey';

        let url = `${URL}/region/${username}/getRegionByAll`;
        fetch(url)
            .then(response => {
                if (response.status === 204) {
                    alert('No results found');
                    return;
                }
                if (response.status === 404) {
                    alert('User not found');
                    return;
                }
                if (response.status === 500) {
                    alert('An error occurred');
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    if (data.length === 0) {
                        alert('No location found');
                        return;
                    }
                    const results = [];
                    for (let result of data.Regions) {
                        results.push(result);
                    }
                    setRegions(results);
                }
                buttonEnabled = true;
                button.style.cursor = 'pointer';
                button.style.backgroundColor = buttonDefaultColor;
            })
            .catch(error => {
                console.log(error);
                alert('An error occurred');
                buttonEnabled = true;
                button.style.cursor = 'pointer';
                button.style.backgroundColor = buttonDefaultColor;
            });
    }

    return (
        <div className="background">
            <div className="container">
                <div className="header">
                    <h1>Predict the top 3 plausible locations of a software developer</h1>
                </div>
                <div className="search-bar">
                    <input type="text" className="input" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                    <div className="search-icon" onClick={search} >
                        <img src={search_icon} alt="search_icon" />
                    </div>
                </div>
                <div className="more-than-3">
                    <label>
                        <input className="checkbox" type="checkbox" onChange={e => setMoreThan3(e.target.checked)} />
                        Show more than 3 results
                    </label>
                </div>
                <div className="results">
                    <Result regions={regions} moreThan3={moreThan3} />
                </div>
            </div>
        </div>
    )
}

export default DetectRegionApp