import React from 'react';
import { render } from '@testing-library/react-native';
import { ListEmptyComponent } from './ListEmptyComponent';

describe('ListEmptyComponent', () => {
  it('should render correctly', () => {
    const { getByText } = render(
      <ListEmptyComponent
        loadingStatus={'success'}
        data={[]}
        text={'No available topics'}
      />
    );

    expect(getByText(/No available topics/i)).toBeTruthy();
  });

  it('should not render', () => {
    const topics = [
      {
        id: 'a5T6g0000009JEoEAM',
        name: 'Meeting Topic 1',
        meetingType: null,
        status: 'Approved',
        startDate: '2020-07-01T19:00:00.000Z',
        endDate: '2020-11-27T20:00:00.000Z',
      },
    ];

    const { queryByText } = render(
      <ListEmptyComponent
        loadingStatus={'success'}
        data={topics}
        text={'No available topics'}
      />
    );
    expect(queryByText(/No available topics/)).toBeNull();
  });
});
