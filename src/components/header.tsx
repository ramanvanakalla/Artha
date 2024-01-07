import Profile from './profile';

const Headers = () => {
  return (
    <div className="navigation py-4 mx-0 shadow-sm">
          <nav className='flex'>
              <a className="px-10 py-2 text-center font-semibold font-serif text-xl tracking-widest text-black">Artha</a>
              <div className='flex justify-between w-full'>
                 <ul className='flex flex-col lg:flex-row md:flex-row'>
                    <li className="px-4 py-2 text-sm text-center text-slate-500 hover:text-black font-sans">Transactions</li>
                    <li className="px-4 py-2 text-sm text-center text-slate-500 hover:text-black font-sans">Categories</li>
                    <li className="px-4 py-2 text-sm text-center text-slate-500 hover:text-black font-sans">Friends</li>
                    <li className="px-4 py-2 text-sm text-center text-slate-500 hover:text-black font-sans">Splits</li>
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