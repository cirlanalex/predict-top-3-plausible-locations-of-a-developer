import React from 'react'
import './Result.css'

const Result = (props) => {
    if (props.regions.length === 0) {
        return null;
    }
    return (
        <div className="results-container">
            <table className="results-table">
                <thead>
                    <tr>
                        <th>Region</th>
                        <th>Percentage</th>
                        <th>From</th>
                    </tr>
                </thead>
                <tbody>
                    {props.regions.map((region, index) => {
                        if (props.moreThan3 || index < 3) {
                            return (
                                <tr key={index}>
                                    <td>{region.Region}</td>
                                    <td>{region.Percentage}%</td>
                                    <td>{region.From.map((from, indexFrom) => {
                                        return (
                                            from + (indexFrom < region.From.length - 1 ? ', ' : '')
                                        )
                                    })}</td>
                                </tr>
                            )
                        }
                        return null;
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Result