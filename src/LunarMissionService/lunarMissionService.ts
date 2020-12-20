import { apiUrl, launchesPastQuery } from './apiQueries';
import { LaunchData } from '../types';
import { getHttpClient, HttpClient } from './httpClient';

const getRequestOptions = (
    resultLimit: number, 
    sortBy: string | null, 
    orderBy: string | null
    ): RequestInit => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const body: string = JSON.stringify({
        query: launchesPastQuery,
        variables: {
            resultLimit,
            sortBy,
            orderBy
        }
    });

    const options: RequestInit = {
        method: "POST",
        redirect: "follow",
        headers,
        body,
    };

    return options;
}

export async function fetchPastLaunches(
    resultLimit: number, 
    sortBy:string | null, 
    orderBy:string | null
    ): Promise<LaunchData[]> {
    const httpClient: HttpClient = getHttpClient()

    const options: RequestInit = getRequestOptions(
        resultLimit, 
        sortBy, 
        orderBy
        );

    const response: Response = await httpClient(apiUrl, options);
    const responseBody = await response.json();

    return responseBody.data.launchesPast;
}


