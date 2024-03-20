import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import UNISWAP_POOL_ABI from './abi/swap.json';

const UNISWAP_POOL_ADDRESS = import.meta.env.VITE_UNISWAP_POOL_ETH_USDT_ADDRESS;
const NETWORK = import.meta.env.VITE_INFURA_NETWORK;
const KEY = import.meta.env.VITE_INFURA_API_KEY;

const provider = new ethers.JsonRpcProvider(
  `https://${NETWORK}.infura.io/v3/${KEY}`
);

const poolContract = new ethers.Contract(
  UNISWAP_POOL_ADDRESS,
  UNISWAP_POOL_ABI,
  provider
);

interface EventData extends ethers.LogDescription {}

const Swap = () => {
  const [poolReserves, setPoolReserves] = useState({
    ethReserve: '0',
    usdtReserve: '0',
  });
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const getReserves = async () => {
      try {
        const reserves = await poolContract.getReserves();
        setPoolReserves({
          ethReserve: ethers.formatEther(reserves._reserve0),
          usdtReserve: ethers.formatUnits(reserves._reserve1, 6),
        });
      } catch (error) {
        console.error('Error fetching reserves:', error);
      }
    };

    const getEvents = async () => {
      const eventFilter = {
        address: UNISWAP_POOL_ADDRESS,
        fromBlock: 0, // номер блока, с которого начать поиск
        toBlock: 'latest',
        topics: [
          ethers.id('Swap(address,uint256,uint256,uint256,uint256,address)'),
        ],
      };

      const logs = await provider.getLogs(eventFilter);
      const eventsData = logs
        .map((log) => poolContract.interface.parseLog(log))
        .filter((event): event is ethers.LogDescription => event !== null);
      setEvents(eventsData);
    };

    getReserves();
    getEvents();
  }, []);

  return (
    <div>
      <h1>Uniswap ETH/USDT Pool Reserves</h1>
      <p>ETH Reserve: {poolReserves.ethReserve}</p>
      <p>USDT Reserve: {poolReserves.usdtReserve}</p>
      <h2>Pool Events</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event.name} - {JSON.stringify(event.args)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Swap;
