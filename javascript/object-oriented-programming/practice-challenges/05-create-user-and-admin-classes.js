const userData = {
    username: 'emma',
    password: 'ZRYAK3GSS3wQujr'
};

const adminData = {
    username: 'sarah',
    password: 'r5tHZE9DUP1SgTB'
}

const userToDelete = 'carter'


// Your code goes here

class User {
  #password; 

  constructor(username, password) {
    this.username = username;
    this.#password = password; 
  }

  #updatePassword(newPassword) {
    this.#password = newPassword;
  }
  
  resetPassword(newPassword) {
    this.#updatePassword(newPassword);
    return 'Your password has been updated';
  }
}

class Admin extends User {
  constructor(username, password) {
    super(username, password);
    this.Admin = true;
  }

  deleteUser(userToDelete) {
    return `The user ${userToDelete} has been deleted.`;
  }
}

const result= [
    new User(userData.username, userData.password),
    new Admin(adminData.username, adminData.password)
]
