import UpdateItem from '../components/UpdateItem';

const Sell = ({ query }) => (
  <div>
    <UpdateItem id={ query.id }>Sell!</UpdateItem >
  </div>
);

export default Sell;