import express from 'express';
import Scheduler from './app/service/Scheduler';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.iniciaScheduler();
  }

  middlewares() {
    this.server.use(express.json());
  }

  iniciaScheduler() {
    const scheduler = Scheduler;
  }
}

export default new App().server;
