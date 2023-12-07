import app from './app';

const port = 8888;

app.listen(port, () => {
  console.log(`App UP At Port ${port} and URL at http://localhost:${port}`);
});
