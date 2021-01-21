import { NestFactory } from '@nestjs/core';
/* 
import {GraphQLSchemaFactory } from '@nestjs/graphql';
import {printSchema, } from 'graphql'; */
 import { AppModule } from './app.module';

/* 
async function generateSchema(app) {
  const gqlSchemaFactory = app.get(GraphQLSchemaFactory);
  const schema = await gqlSchemaFactory.create([RecipesResolver]);
  console.log(printSchema(schema));
} */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "credentials":true
  });
  await app.listen(3001);
}
bootstrap();
