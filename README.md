# NextAuth Credentials Authentication with Prisma
## Todo
- [x] Work with Prisma
- [x] Update NextAuth
- [x] Update Nextjs
- [x] Remove MongoDB code
- [x] Auto login after registration
- [x] Password Change Function
- [ ] Password Reset Function with Nodemailer
- [ ] Login/Register Form Feedback

## Error
`getSession` returns null on .env variable `NEXTAUTH_URL=http://localhost:3003`

## Getting Started

First, run the development server:

```bash
npm run dev
# or
npm run dev -- -p 3003
```

## Prisma Setup
1. `npm install next-auth@beta @prisma/client @next-auth/prisma-adapter@next`
2. `npm install prisma --save-dev`
3. `npx prisma migrate dev`
4. `npx prisma generate`
5. `npx prisma migrate dev`

## Development
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!