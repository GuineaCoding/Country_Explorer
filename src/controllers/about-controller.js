export const aboutController = {
  // Handler for rendering the about page
  index: {
    // Check if the user is an admin and set view data accordingly
    handler: function (request, h) {
      const isAdmin = request.auth.credentials && request.auth.credentials.role === "admin";
      const viewData = {
        title: "About Landmark",
        isAdmin: isAdmin
      };
      // Render the about page view with the provided data
      return h.view("about-view", viewData);
    },
  },
};
