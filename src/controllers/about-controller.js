export const aboutController = {
  index: {
    handler: function (request, h) {
      const viewData = {
        title: "About Landmark",
      };
      return h.view("about-view", viewData);
    },
  },
};