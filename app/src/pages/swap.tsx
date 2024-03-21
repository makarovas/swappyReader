import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import UNISWAP_POOL_ABI from '../abi/swap.json';

const UNISWAP_POOL_ADDRESS = import.meta.env.VITE_UNISWAP_POOL_ETH_USDT_ADDRESS;
const NETWORK = import.meta.env.VITE_INFURA_NETWORK;
const KEY = import.meta.env.VITE_INFURA_API_KEY;

const webSocketProvider = new ethers.WebSocketProvider(
  `wss://${NETWORK}.infura.io/ws/v3/${KEY}`
);

const jsonRpcProvider = new ethers.JsonRpcProvider(
  `https://${NETWORK}.infura.io/v3/${KEY}`
);

const poolContract = new ethers.Contract(
  UNISWAP_POOL_ADDRESS,
  UNISWAP_POOL_ABI,
  webSocketProvider
);

interface EventData extends ethers.LogDescription {}

const Swap = ({ path }: { path: string }) => {
  const [poolReserves, setPoolReserves] = useState({
    ethReserve: '0',
    usdtReserve: '0',
  });
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const handleSwapEvent = (
      from: any,
      amount0: string,
      amount1: string,
      event: any
    ) => {
      console.log('New Swap event:', event, 40);

      const formattedAmount0 = ethers.formatUnits(amount0, 'ether');
      const formattedAmount1 = ethers.formatUnits(amount1, 'ether');
      const newEvent = {
        name: 'Swap',
        args: {
          from,
          amount0: formattedAmount0,
          amount1: formattedAmount1,
        },
        blockNumber: event.blockNumber,
      };

      setEvents((currentEvents: any) => [...currentEvents, newEvent]);
    };
    poolContract.on('Swap', handleSwapEvent);

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

    // const getEvents = async () => {
    //   const startBlock = 0;
    //   const endBlock = 2;
    //   const eventFilter = {
    //     address: UNISWAP_POOL_ADDRESS,
    //     fromBlock: startBlock, // номер блока, с которого начать поиск
    //     toBlock: endBlock,
    //     topics: [
    //       ethers.id('Swap(address,uint256,uint256,uint256,uint256,address)'),
    //     ],
    //   };

    //   const logs = await provider.getLogs(eventFilter);
    //   const eventsData = logs
    //     .map((log) => poolContract.interface.parseLog(log))
    //     .filter((event): event is ethers.LogDescription => event !== null);
    //   setEvents(eventsData);
    // };

    getReserves();
    // getEvents();
    return () => {
      poolContract.off('Swap', handleSwapEvent);
    };
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
            {event.name} - From: {event.args.from} Amount0: {event.args.amount0}{' '}
            Amount1: {event.args.amount1}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Swap;
