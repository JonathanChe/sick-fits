// npm installs
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

// rel path imports
import SingleItem, { SINGLE_ITEM_QUERY } from '../components/SingleItem';
import { fakeItem } from '../lib/testUtils';

describe('<SingleItem/>', () => {
  it('renders with the proper data', async () => {
    const mocks = [
      {
        // when someone makes a request with this query/variable combo 
        request: {query: SINGLE_ITEM_QUERY, variables: { id: '123' }},
        // then return this fake data (mocked data)
        result: {
          data: {
            item: fakeItem(),
          }
        }
      }
    ];
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123"/>
      </MockedProvider>
    );

    expect(wrapper.text()).toContain('Loading...');
    await wait();
    expect(toJSON(wrapper.find('h2'))).toMatchSnapShot();
    expect(toJSON(wrapper.find('img'))).toMatchSnapShot();
    expect(toJSON(wrapper.find('p'))).toMatchSnapShot();
  });

  it('Errors with a not found item', async () => {
    const mocks = [
      {
        request: {query: SINGLE_ITEM_QUERY, variables: { id: '123' }},
        result: {
          errors: [
            {
              message: 'Items Not Found',
            }
          ]
        }
      },
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <SingleItem id="123"/>
      </MockedProvider>
    );

    await wait();
    wrapper.update();
    const item = wrapper.find('[data-test="graphql-error"]');
    expect(item.text()).toContain('Items Not Found!');
    expect(toJSON(item)).toMatchSnapShot();
  });

})
