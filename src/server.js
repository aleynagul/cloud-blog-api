import http from 'http';
import app from './app.js';

function startServer(port) {
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`Server ${port} portunda çalışıyor`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} dolu, ${port + 1} deneniyor...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

const BASE_PORT = Number(process.env.PORT) || 5000;
startServer(BASE_PORT);
