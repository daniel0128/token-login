const Users = require('./model/user');
const SampleUser = {
  email: 'testing@gmail.com',
  password: '1234'
};

function storeSampleUser(){
  const user = new Users(SampleUser);
  return user.save().then(user => {
    console.log('user stored');
    return user;
  });
}

module.exports = {
  storeSampleUser
}
