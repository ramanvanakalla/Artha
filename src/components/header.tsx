import { Link } from 'react-router-dom';
import Profile from './profile';

const Headers = () => {
  return (
    <div className="navigation py-4 mx-0 shadow-sm top-0 w-full fixed bg-white z-10">
      <nav className='flex'>
        <Link to='/' className="px-10 py-2 text-center font-semibold font-serif text-xl tracking-widest text-black">Artha</Link>
        <div className='flex justify-between w-full'>
          <ul className='flex flex-col lg:flex-row md:flex-row'>
            <li className="px-4 py-2">
              <Link to="/transactions" className='text-center text-sm text-slate-500 hover:text-black font-sans'>Transactions</Link>
            </li>
            <li className="px-4 py-2">
              <Link to="/Categories" className='text-center text-sm text-slate-500 hover:text-black font-sans'>Categories</Link>
            </li>
            <li className="px-4 py-2">
              <Link to="/Friends" className='text-center text-sm text-slate-500 hover:text-black font-sans'>Friends</Link>
            </li>
            <li className="px-4 py-2">
              <Link to="/Splits" className='text-center text-sm text-slate-500 hover:text-black font-sans'>Splits</Link>
            </li>
          </ul>
          <div className='mx-4'>
            <Profile></Profile>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Headers;
