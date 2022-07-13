## How to contribute to Next.js for Acquia CMS

> **_NOTE:_** You can use the web server of your choice.

1. Have Acquia CMS installed from https://github.com/acquia/next-acms/blob/main/README.md#installation-acquia-cms with your Node environment variables copied to your clipboard.

![image](https://user-images.githubusercontent.com/35243020/178577853-d6e91755-e6e3-4d62-9e56-ef7b7566c2c1.png)

3. Fork the `acquia/next-acms` project repo and pull it down to your local machine (outside of the ACMS directory is recommended) and add the original repo as the upstream.

```
$ cd next-acms
$ git remote add upstream https://github.com/acquia/next-acms
```

4. Create an `.env.local` file in the `/starters` directory in your forked repo and paste in your environment variables from step 1.
5. From the root directory, run `yarn install,` `yarn build`, then `yarn dev` to start the development server on `http://localhost:3000`.

   > **_NOTE:_** Next.js preview mode only works in production mode.

6. Now you can make changes to your repo, commit them, push them up to your remote, then create a pull request for `acquia/next-acms` to contribute.

![Screen Shot 2022-07-12 at 3 32 03 PM](https://user-images.githubusercontent.com/35243020/178578712-72093f45-64d7-4b30-a8f0-442b418ea033.png)

## How to debug with Chrome DevTools

Running `yarn dev` will also run `NODE_OPTIONS='--inspect'` which will allow you to debug server-side Next.js, and it can be accessed by visiting [chrome://inspect/#devices](url) in your browser.

![image](https://user-images.githubusercontent.com/35243020/178579872-6f30e37f-275e-449b-a798-64c55c7de912.png)

Click the inspect link at the end of file path at the end of the page, and it will open up a DevTools window. From there, you can click the Sources tab, hit Ctrl+P on Windows/Linux or ⌘+P on macOS to navigate to the file you want to debug.

For debugging using the VS Code debugger please see: https://nextjs.org/docs/advanced-features/debugging
