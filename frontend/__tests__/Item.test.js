import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ItemComponent from '../components/Item';


const fakeItem = {
  id: 'ABC123',
  title: 'A Cool Item',
  price: 5000,
  description: 'This item is really cool', 
  image: 'dog.jpg',
  largeImage: 'largedog.jpg',
};

describe('<Item/>', () => {
  const wrapper = shallow(<ItemComponent item={fakeItem}/>);
  
  it ('renders and matches the snapshot', () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('renders the image properly', () => {
    const img = wrapper.find('img');
    expect(img.props().src).toBe(fakeItem.image);
    expect(img.props().alt).toBe(fakeItem.title);
  });

  it('renders and displays properly', () => {
    const PriceTag = wrapper.find('PriceTag');
    expect(PriceTag.dive().text()).toBe(" $50 ");
    expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
  });

  it('renders out the buttons properly', () => {
    const buttonList = wrapper.find('.buttonList');
    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find('Link')).toHaveLength(1);
  })
});