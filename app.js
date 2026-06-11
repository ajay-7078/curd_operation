const express = require('express');
const path = require('path');
const userMOdel = require('./modules/user');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/read', async (req, res) => {
  try {
    const users = await userMOdel.find();
    res.render('read', { users });
  } catch (error) {
    console.error(error);
    res.render('read', { users: [] });
  }
});
app.get('/delete/:id', async (req, res) => {
   try {
      await userMOdel.findByIdAndDelete(req.params.id);
      res.redirect('/read');
   } catch (error) {
      res.send("Error deleting user");
   }
});
app.post('/create', async (req, res) => {
  const { name, email, image } = req.body;
  try {
    const createdUser = await userMOdel.create({ name, email, image });
    res.send(createdUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to create user');
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});