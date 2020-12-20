import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { LaunchData } from '../types';
import LaunchList from './LaunchList';

import { fetchPastLaunches } from '../LunarMissionService/lunarMissionService';
import userEvent from '@testing-library/user-event';
jest.mock('../LunarMissionService/lunarMissionService');

const mockLaunches: LaunchData[] = [
  {
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
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Satellite"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-11-01T00:00:00.000Z",
    "mission_name": "SXM-7",
    "id": "110",
    "links": {
      "mission_patch_small": null
    }
  },
  {
    "rocket": {
      "rocket_name": "Falcon 9",
      "second_stage": {
        "payloads": [
          {
            "payload_type": "Dragon 1.1"
          }
        ],
        "block": 5
      }
    },
    "launch_date_utc": "2020-12-02T17:50:00.000Z",
    "mission_name": "CRS-21",
    "id": "112",
    "links": {
      "mission_patch_small": null
    }
  }
];

beforeEach(() => {
  (fetchPastLaunches as jest.Mock).mockResolvedValue(mockLaunches)
})

test('renders past launches', async () => {
  render(<LaunchList/>);

  const titleElement = screen.getByText("Past Launches");
  expect(titleElement).toBeInTheDocument();

  const items = await screen.findAllByRole('listitem');
  expect(items.length).toBe(mockLaunches.length);

  expect(fetchPastLaunches).toBeCalledTimes(1);
});

test('renders sort by dropdown', async () => {
  render(<LaunchList/>);

  const dropdownElement = await screen.findByRole('combobox');
  expect(dropdownElement).toBeInTheDocument();
});

test(`fetches launches past sorted by mission name ascending 
if that option is selected`, async () => {
  const { getByLabelText } = render(<LaunchList/>);

  await act(async () => {
    const event = {
      target: {
        value:'{"sort":"mission_name","order":"asc"}'
      }
    }
    const dropdown = getByLabelText('Sort by')
    fireEvent.change(dropdown, event)
  })
  
  expect(fetchPastLaunches).toBeCalledWith(10, 'mission_name', 'asc')
});

test(`fetches launches past sorted by mission name descending 
if that option is selected`, async () => {
  const { getByLabelText } = render(<LaunchList/>);

  await act(async () => {
    const event = {
      target: {
        value:'{"sort":"mission_name","order":"desc"}'
      }
    }
    const dropdown = getByLabelText('Sort by')
    fireEvent.change(dropdown, event)
  })
  
  expect(fetchPastLaunches).toBeCalledWith(10, 'mission_name', 'desc')
});

test(`fetches launches past sorted by launch date asc 
if that option is selected`, async () => {
  const { getByLabelText } = render(<LaunchList/>);

  await act(async () => {
    const event = {
      target: {
        value:'{"sort":"launch_date_local","order":"asc"}'
      }
    }
    const dropdown = getByLabelText('Sort by')
    fireEvent.change(dropdown, event)
  })
  
  expect(fetchPastLaunches).toBeCalledWith(10, 'launch_date_local', 'asc')
});

test(`fetches launches past sorted by launch date desc 
if that option is selected`, async () => {
  const { getByLabelText } = render(<LaunchList/>);

  await act(async () => {
    const event = {
      target: {
        value:'{"sort":"launch_date_local","order":"desc"}'
      }
    }
    const dropdown = getByLabelText('Sort by')
    fireEvent.change(dropdown, event)
  })
  
  expect(fetchPastLaunches).toBeCalledWith(10, 'launch_date_local', 'desc')
});

test(`does not fetches launches past if sort by option is empty`, async () => {
  const { getByLabelText } = render(<LaunchList/>);

  await act(async () => {
    const event = {
      target: {
        value:''
      }
    }
    const dropdown = getByLabelText('Sort by')
    fireEvent.change(dropdown, event)
  })
  
  expect(fetchPastLaunches).toBeCalledTimes(1)
});

test('renders search input', async () => {
  render(<LaunchList/>);

  const searchInput = await screen.findByRole('textbox');
  expect(searchInput).toBeInTheDocument();
});

test(`filters missions by name, search for 'C'`, async () => {
  const { getByLabelText } = render(<LaunchList/>);

  const search = getByLabelText('Search')
  userEvent.type(search, 'C')
  
  const items = await screen.findAllByRole('listitem');
  expect(items.length).toBe(2);
})

test(`filters missions by name, case insensitive`, async () => {
  const { getByLabelText } = render(<LaunchList/>);

  const search = getByLabelText('Search')
  userEvent.type(search, 'c')
  
  const items = await screen.findAllByRole('listitem');
  expect(items.length).toBe(2);
})

test(`filters missions by name, 
it displays the full list when the text field is emptied`, async () => {
  const { getByLabelText } = render(<LaunchList/>);

  const search = getByLabelText('Search')
  userEvent.type(search, 'Crew-1')
  userEvent.type(search, '{backspace}Crew-1')
  
  const items = await screen.findAllByRole('listitem');
  expect(items.length).toBe(3);
})

