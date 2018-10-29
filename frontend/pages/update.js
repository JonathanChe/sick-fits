import UpdateItems from '../components/UpdateItems';

const Sell = ({ query }) => (
  <div>
    <UpdateItems id={ query.id }>Sell!</UpdateItems >
  </div>
);

export default Sell;