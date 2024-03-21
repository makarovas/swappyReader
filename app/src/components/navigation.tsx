import { Link } from 'preact-router/match';

export const Navigation = () => {
  return (
    <nav>
      <ul class='flex'>
        <li class='text-blue-500 hover:text-blue-800 mr-6'>
          <Link activeClassName='active' href='/'>
            Home
          </Link>
        </li>
        <li class='text-blue-500 hover:text-blue-800 mr-6'>
          <Link activeClassName='active' href='/swap'>
            Swap
          </Link>
        </li>
        <li class='text-blue-500 hover:text-blue-800 mr-6'>
          <Link activeClassName='active' href='/arb'>
            Arb
          </Link>
        </li>
        <li class='text-gray-400 cursor-not-allowed mr-6'>
          <Link activeClassName='active' href='/arb'>
            Docs
          </Link>
        </li>
      </ul>
    </nav>
  );
};
