# Munia 

A responsive and accessible full stack social media web app.

## Preview 🎬

[![Watch the showcase](https://norcio-dot-dev-public-files.s3.us-east-1.amazonaws.com/munia/showcase-thumbnail.png)](https://norcio-dot-dev-public-files.s3.us-east-1.amazonaws.com/munia/showcase.mp4)


## Features ✨

- Email and OAuth 2.0 login (Github, Google and Facebook)
- Users can update their info, profile photo and cover photo
- Create, update and delete posts, comments and replies
- Like and unlike posts, comments and replies
- Images and videos can be added to posts
- Drag and drop sorting of images and videos when creating and editing a post
- Hashtags can be added to posts
- Users can @ mention other users in their posts, comments and replies
- Bidirectional infinite scrolling of posts
- Follow and unfollow other users
- Search users with filters
- Display, search and filter a user's followers and following list
- Activity logging and notifications
- Gallery of user's uploaded photos and videos
- Full-page image and videos slider
- Accessible components
- Fully responsive design
- Dark and light themes

> [!NOTE]  
> This project is a work in progress, it still contains bugs and will constantly be updated to stay up-to-date with the latest framework changes.

## Tech Stack 🛠️

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest/docs/react/overview)
- [React Aria](https://react-spectrum.adobe.com/react-aria/getting-started.html)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Prisma](https://www.prisma.io/)
- [AWS S3](https://aws.amazon.com/s3/)
- [AWS SES](https://aws.amazon.com/ses/)

## About this project

This project is an open source portfolio project that explores how can a social media app be built with Next.js.

It utilizes the following Next.js features:

- routing
- static and dynamic rendering
- server and client components
- nested layouts
- route handlers
- middleware
- font optimizations
- dynamic metadata

Due to the highly dynamic nature of social media apps, most data fetching and mutations are done on the client-side using React Query.

React Query simplifies the implementation of features that would have been challenging and inefficient with Next.js's server components and server actions. These features include bidirectional infinite scrolling, optimistic updates, client-side data caching, client-side loading states, and more.

## Accessibility

The UI components are built with React Aria's accessibility hooks, assuring accessibility across different platforms.

## Deployment on EC2

Follow these steps to deploy Munia on an EC2 instance.

1. Set up a PostgreSQL database and copy its connection URL into `.env`.
2. Set up a client application for each OAuth provider (Github, Google and Facebook) and copy the client id's and client secrets into `.env.local`.
3. Run `npm install`
4. Run `npm run prisma:deploy`
5. Run `npm run prisma:seed`
6. Run `npm run pm2` (or `npm run build` and then `npm run start` if you're not using PM2). You can modify the port specified in the `pm2` script depending on your server configuration.
