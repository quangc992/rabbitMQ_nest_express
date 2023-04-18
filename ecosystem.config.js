module.exports = {
    apps: [
      {
        name: "handle_express_nestjs",
        script: "npm start",
        autorestart: true,
        max_memory_restart: "10G",
      },
    ],
  };