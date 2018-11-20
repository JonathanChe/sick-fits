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
    const wrapper = mount(<SingleItem id="123"/>)

  });

})
