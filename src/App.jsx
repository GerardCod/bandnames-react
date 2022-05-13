import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { BandAdd } from './components/BandAdd'
import { BandList } from './components/BandList'

const connectSocketServer = () => {
  const socket = io('http://localhost:8081', {
    transports: ['websocket'],
  });
  return socket;
}

function App() {
  const [socket] = useState(connectSocketServer())
  const [online, setOnline] = useState(false);
  const [ bands, setBands ] = useState([]);

  useEffect(() => {
    console.log('Conectado');
    setOnline(socket.connected);
  
  }, [ socket ])
  
  useEffect(() => {
    socket.on('connect', () => {
      setOnline(true);
    });    
  
  }, [ socket ])
  
  useEffect(() => {
    socket.on('disconnect', () => {
      setOnline(false);
    });
  }, [ socket ])

  useEffect(() => {
    socket.on('current-bands', (data) => {
      setBands(data);
    });    
  
  }, [socket])
  
  const votar = (id) => {
    console.log('votar - app ');
    socket.emit('votar-banda', { id });
  }

  return (
    <div className="container">
      <div className='alert'>
        <p>
          Service status:
          {
            online ? <span className='text-success'> Online</span>
            : <span className='text-danger'> Offline</span>
          } 
        </p>
      </div>

      <h1>Band names</h1>
      <hr/>

      <div className='row'>

        <div className='col-8'>
          <BandList data={bands} votar={votar} />
        </div>


        <div className='col-4'>
          <BandAdd />
        </div>

      </div>

    </div>
  )
}

export default App
