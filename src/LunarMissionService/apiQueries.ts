export const apiUrl: string = 'https://api.spacex.land/graphql/';

export const launchesPastQuery: string = `query LaunchesPast(
      $resultLimit: Int, 
      $sortBy: String, 
      $orderBy: String
    ) {
        launchesPast(limit: $resultLimit, sort: $sortBy, order: $orderBy) {
            rocket {
                rocket_name
                second_stage {
                    payloads {
                    payload_type
                    }
                    block
                }
            }
            launch_date_utc
            mission_name
            id
            links {
                mission_patch_small
            }
        }                                                           
}`;