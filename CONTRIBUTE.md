## How to contribute to Next.js for Acquia CMS

> **_NOTE:_** You can use the web server of your choice.

1. Have Acquia CMS installed from https://github.com/acquia/next-acms/blob/main/README.md#installation-acquia-cms with your Node environment variables copied to your clipboard.

![Screenshot of environment variables example on ACMS](assets/env_variables.png)

3. Fork the `acquia/next-acms` project repo and pull it down to your local machine (outside of the ACMS directory is recommended) and add the original repo as the upstream.

```
$ cd next-acms
$ git remote add upstream https://github.com/acquia/next-acms
```

4. Create an `.env.local` file in the `/starters` directory in your forked repo and paste in your environment variables from step 1.
5. From the root directory, run `yarn install,` `yarn build`, then `yarn dev` to start the development server on `http://localhost:3000`.

   > **_NOTE:_** Next.js preview mode only works in production mode.

6. Now you can make changes to your repo, commit them, push them up to your remote, then create a pull request for `acquia/next-acms` to contribute.

## How to debug with Chrome DevTools

Running `yarn dev` will also run `NODE_OPTIONS='--inspect'` which will allow you to debug server-side Next.js, and it can be accessed by visiting [chrome://inspect/#devices](url) in your browser.

![Screenshot of chrome inspect](assets/chrome_dev_tools.png)

Click the inspect link at the end of file path at the end of the page, and it will open up a DevTools window. From there, you can click the Sources tab, hit Ctrl+P on Windows/Linux or ⌘+P on macOS to navigate to the file you want to debug.

For debugging using the VS Code debugger please see: https://nextjs.org/docs/advanced-features/debugging
