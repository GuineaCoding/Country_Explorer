
// import { expect } from 'chai';
// import { accountsModel } from "../../src/models/accounts-model.js"; 


// const mockDatabase = {
//   data: {},
//   ref: function (path) {
//     return {
//       set: (value) => {
//         mockDatabase.data[path] = value;
//         return Promise.resolve();
//       },
//       get: () => {
//         return Promise.resolve({ val: () => mockDatabase.data[path] });
//       }
//     };
//   }
// };


// accountsModel.getDatabase = () => mockDatabase;

// describe('Accounts Model', function() {
//   beforeEach(() => {
   
//     mockDatabase.data = {};
//   });

//   describe("createUser", function() {
//     it("should add a user with a default role of user", async function() {
//       const user = { email: 'test@example.com', name: 'Test User' };
//       await accountsModel.createUser(user);

//       const savedUser = mockDatabase.data[`users/${user.email.replace(/\./g, ',')}`];
//       expect(savedUser).to.be.an('object');
//       expect(savedUser).to.have.property('role', 'user');
//       expect(savedUser).to.have.property('email', user.email);
//       expect(savedUser).to.have.property('name', user.name);
//     });
//   });


// });
