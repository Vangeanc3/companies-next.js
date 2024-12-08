import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withTM = require('next-transpile-modules')(['antd', '@ant-design/icons', 'rc-util']);

module.exports = withTM({
  reactStrictMode: true,
});

export default nextConfig;
