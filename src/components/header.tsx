import { Link, useLocation } from 'react-router-dom';
import Profile from './profile';
import { DatePickerWithRange } from './dateRange';

const Headers = () => {
  const location = useLocation();
  return (
    <div className="navigation py-4 mx-0 shadow-sm top-0 w-full fixed bg-white z-10">
      <nav className='flex'>
        <Link to='/' className="px-10 py-2 text-center font-semibold font-serif text-xl tracking-widest text-black">Artha</Link>
        <div className='flex justify-between w-full'>
          <ul className='flex flex-row'>
            <li className={`px-4 py-2 ${location.pathname === '/' ? 'text-black' : ''}`}>
              <Link to="/transactions" className={`text-center text-sm ${location.pathname === '/transactions' ? 'text-black' : 'text-slate-500'} hover:text-black font-sans`}>Transactions & Categories</Link>
            </li>
            <li className={`px-4 py-2 ${location.pathname === '/splits' ? 'text-black' : ''}`}>
              <Link to="/splits" className={`text-center text-sm ${location.pathname === '/splits' ? 'text-black' : 'text-slate-500'} hover:text-black font-sans`}>Friends & Splits</Link>
            </li>
          </ul>
          <DatePickerWithRange></DatePickerWithRange>
          <div className='mx-4'>
            <Profile></Profile>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Headers;
