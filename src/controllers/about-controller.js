export const aboutController = {
  index: {
    handler: function (request, h) {
      const isAdmin = request.auth.credentials && request.auth.credentials.role === "admin";
      const viewData = {
        title: "About Landmark",
        isAdmin: isAdmin
      };
      return h.view("about-view", viewData);
    },
  },
};
