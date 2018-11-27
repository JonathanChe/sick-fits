// npm installs
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import wait from 'waait';

// rel path imports
import { fakeUser } from '../lib/testUtils';
import PleaseSignIn from '../components/PleaseSignIn';
import { CURRENT_USER_QUERY } from '../components/User';

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null }},
  }
];

const signedInMock = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() }},
  }
];

describe('<PleaseSignIn/>', () => {
  it('renders the sign in dialogue', async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn/>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    expect(wrapper.text()).toContain('Please Sign In before Continuing');
    expect(wrapper.find('Signin')).exists().toBe(true);
  });

  it('renders the child component when the user is signed in', async () => {
    const Child = () => <p>Testing</p>
    const wrapper = mount(
      <MockedProvider mocks={signedInMock}>
        <PleaseSignIn/>
          <Child />
      </MockedProvider>
    );
    
    await wait();
    wrapper.update();
    expect(wrapper.contains(<Child/>)).toBe(true);
  });
});
