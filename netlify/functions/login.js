// netlify/functions/login.js
exports.handler = async (event) => {
  const { password } = JSON.parse(event.body);
  const correctPassword = process.env.ADMIN_PASSWORD;

  const authenticated = password === correctPassword;

  return {
    statusCode: authenticated ? 200 : 401,
    body: JSON.stringify({ authenticated })
  };
};
