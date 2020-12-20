import { render, screen } from '@testing-library/react';
import React from 'react';
import { formatDateTime } from './helpers';
import LaunchListEntry from './LaunchListEntry';

jest.mock('./helpers')

const formattedDate = '20/12/2020/';

beforeEach(() => {
    (formatDateTime as jest.Mock).mockReturnValue(formattedDate)
})

test(`passes the launch_date_utc to the 
date formatter and renders the result`, async() => {
    // Arrange
    const launchDateUtc = "2020-11-15T00:49:00.000Z";
    const entry = {
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
        "launch_date_utc": launchDateUtc,
        "mission_name": "Crew-1",
        "id": "107",
        "links": {
          "mission_patch_small": null
        }
      }
    
    // Act
    render(<LaunchListEntry entry={entry} />);

    // Assert
    expect(formatDateTime).toHaveBeenCalledWith(launchDateUtc)
    const dateElement = await screen.findByText(formattedDate);
    expect(dateElement).toBeInTheDocument();
})