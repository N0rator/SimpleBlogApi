import HttpException from '@lib/httpException';
import express, { Express, NextFunction, Request, Response } from 'express';
import PostsController from './api/posts/posts.controller';
import { Logger, LoggerMiddleware } from './lib/logger'

const app: Express = express();
const port = 8000;

const postsController = new PostsController();

// Cors

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
 });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(LoggerMiddleware);
app.use('/', postsController.router);

// Error handling middleware
app.use((error: HttpException, request: Request, response: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  Logger.error(`Path: ${request.path}. Message: ${error.message}`);

  response
    .status(status)
    .send(message);

  next();
})

app.listen(port, () => {
  Logger.info(`Server is running at http://localhost:${port}`);
});