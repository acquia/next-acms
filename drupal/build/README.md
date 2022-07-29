This directory contains everything needed to build a container image of the
Acquia CMS Headless backend.

You'll need to be on a *nix-type system (I'm using macOS) with the Docker engine
installed (i.e., the `docker` command needs to be available). I'm using Colima
as my container runtime, and have not tested this with anything else.

`build.sh` will do all the work. It will generate an image tagged
`phenaproxima/acquia_cms:headless`. The build process will leave two artifacts:
`.env`, which contains the environment variables for the Next.js site, and
`database.php.gz`, which is a compressed, backend-agnostic database dump
(excluding cache data). The `.env` file is coupled to the database, so
they need to change together.
