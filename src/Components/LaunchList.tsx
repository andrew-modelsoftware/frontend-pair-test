import React from "react";

import { LaunchData } from '../types';

import { fetchPastLaunches } from '../LunarMissionService/lunarMissionService';
import LaunchListEntry from './LaunchListEntry';

type Props = {
    limit?: number
}

type SortOrder = {
    sort: string |null,
    order: string | null
}

let launchMissionResults: LaunchData[];

const LaunchList: React.FC<Props> = ({limit = 10}) => {
    const [entries, setEntries] = React.useState<LaunchData[]>([]);
    const [sortOrder, setSortOrder] = React.useState<SortOrder>({
            sort: null, 
            order: null
        })

    React.useEffect(() => {
        const retrieveListItems = async () => {
            const {sort, order} = sortOrder
            launchMissionResults = await fetchPastLaunches(limit, sort, order);
            setEntries(launchMissionResults)
        };

        retrieveListItems();
    }, [ limit, sortOrder]);

    return (
        <section className="App-list">
            <h4>Past Launches</h4>
            <p>List of past SpaceX launches</p>
            <div className="App-list-controls">
                <div className="App-list-control">
                    <label htmlFor="sortOrder">
                        Sort by
                    </label>
                    <select name="sortOrder" id="sortOrder" data-testid="sortOrder" onChange={(e)=>{
                       if(e.target.value) {
                            const {sort, order} = JSON.parse(e.target.value)
                            setSortOrder({
                                sort,
                                order
                            });
                        }
                        
                    }}>
                        <option value="">-</option>
                        <option 
                            value={'{"sort":"mission_name","order":"asc"}'}
                            >Mission Name Ascending</option>
                        <option 
                            value={'{"sort":"mission_name","order":"desc"}'}
                            >Mission Name Descending</option>
                        <option 
                            value={'{"sort":"launch_date_local","order":"asc"}'}
                            >Launch Date Ascending</option>
                        <option 
                            value={'{"sort":"launch_date_local","order":"desc"}'}
                            >Lanuch Date Descending</option>
                    </select>
                </div>
                <div className="App-list-control">
                    <label htmlFor="textSearch">
                        Search
                    </label>
                    <input name="textSearch" id="textSearch"
                        placeholder="Type mission name..."
                        data-testid="textSearch"  onChange={(e)=>{
                            
                            const filtered = launchMissionResults.filter(
                                ({ mission_name }) => mission_name.toLowerCase()
                                    .startsWith(e.target.value.toLowerCase()
                                    )    
                                )

                            setEntries(filtered)
                        }}/>
                </div>
            </div>
            <ul>{
                entries.map((entry) => <li key={entry.id}>
                    <LaunchListEntry entry={entry}/>
                </li>)
            }</ul>
        </section>
    )
};

export default LaunchList;