import { getHttpClient } from './httpClient';
import { apiUrl, launchesPastQuery } from './apiQueries';
import { LaunchData } from '../types';
import { fetchPastLaunches } from './lunarMissionService';

jest.mock('./httpClient');
const httpClient = jest.fn()

beforeEach(() => {
    (getHttpClient as jest.Mock).mockReturnValue(httpClient)
})

test(`gets the HTTP Client, 
makes the request with the expected options, 
gets the response body and returns the launch data`, async() => {
    // Arrange
    const launchesPast: LaunchData[] = [{
        "rocket": {
          "rocket_name": "Falcon 9",
          "second_stage": {
            "payloads": [
              {
                "payload_type": "Crew Dragon"
              }
            ],
            "block": 5
          }
        },
        "launch_date_utc": "2020-11-15T00:49:00.000Z",
        "mission_name": "Crew-1",
        "id": "107",
        "links": {
          "mission_patch_small": null
        }
      }]
    const responseBody = {
        data: {
            launchesPast
        }
    }
    const response  = {
        json: jest.fn().mockResolvedValue(responseBody)
    }

    httpClient.mockResolvedValue(response)

    const resultLimit = 10;
    const sortBy = 'foo';
    const orderBy = 'bar';

    // Act
    const result = await fetchPastLaunches(
        resultLimit,
        sortBy,
        orderBy
        )
    
    // Assert
    const expectedURL = apiUrl;
    const expectedRequestOptions = {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify({
            query: launchesPastQuery,
            variables: {
                resultLimit,
                sortBy,
                orderBy
            }
        })
    }
    expect(httpClient).toHaveBeenCalledWith(expectedURL, expectedRequestOptions);
    expect(result).toBe(launchesPast)
})
