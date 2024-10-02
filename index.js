const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');


/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
app.use(express.json());

router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

/*
- Return all details from user.json file to client as JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
      if (err) {
          return res.status(500).json({ message: 'Error reading user data' });
      }
      res.json(JSON.parse(data));
  });
});



/*
- Modify /login router to accept username and password as JSON body parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Read user.json file
  fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'Server Error' });
    }

    const user = JSON.parse(data); // Parse the user object from the JSON file

    // Check if the username is valid
    if (user.username !== username) {
      return res.json({ status: false, message: 'User Name is invalid' });
    }

    // Check if the password is valid
    if (user.password !== password) {
      return res.json({ status: false, message: 'Password is invalid' });
    }

    // If both username and password are valid
    return res.json({ status: true, message: 'User Is valid' });
  });
});



/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
// Logout route

router.get('/logout/:username?', (req, res) => {
  const { username } = req.params; // Extract username if it exists

  if (username) {
    res.send(`<b>${username} successfully logged out.</b>`);
  } else {
    res.send('<b>You have successfully logged out.</b>'); // Default message if no username is provided
  }
});
module.exports = router;






/*
Add error handling middleware to handle below error
- Return 500 page with message "Server Error"
*/

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).send('Server Error'); // Send 500 status with error message
});

app.use('/', router);

// Start the server
app.listen(process.env.PORT || 8081, () => {
  console.log('Web Server is listening at port ' + (process.env.PORT || 8081));
});
