// npm imports
import Link from 'next/link';

// rel path imports
import User from './User';
import NavStyles from './styles/NavStyles';

const Nav = () => (
  <NavStyles>
    <User>
      {({ data: { me }}) => {
        if (me) return <p>{me.name}</p>
        return null;
      }}
    </User>
    <Link href="/items">
      <a>Shop</a>
    </Link>
    <Link href="/sell">
      <a>Sell</a>
    </Link>
    <Link href="/signup">
      <a>SignUp</a>
    </Link>
    <Link href="/orders">
      <a>Orders</a>
    </Link>
    <Link href="/me">
      <a>Account</a> 
    </Link>
  </NavStyles>
)

export default Nav;