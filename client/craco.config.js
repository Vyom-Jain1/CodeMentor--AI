module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          "date-fns": require.resolve("date-fns"),
        },
      },
    },
  },
};
