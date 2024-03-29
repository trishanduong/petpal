/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  images: {
   domains: ['utfs.io', 'st3.depositphotos.com', 'cdn.discordapp.com', 'res.cloudinary.com'],
  },
};

//utfs.io
export default config;
