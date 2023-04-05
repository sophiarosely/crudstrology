// const User = require('./user.js');
const fakeTarot = require('./fakeData/tarot.json');
const fakeHoro = require('./fakeData/horoscope.json');
const fakeQuote = require('./fakeData/quotes.json');

const axios = require('axios');


// console.log('fake Tarot', fakeTarot.cards[0]);

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'dbstrology',
  'root',
  '',
  {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false
  }
);

const User = sequelize.define('user', {
  googleId: {
    type: Sequelize.STRING,
  },
  user_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING
  },
  dob: {
    type: Sequelize.STRING
  },
  sign: {
    type: Sequelize.STRING
  }
});

// <-- May need to include Foreign Key for realtionship with User...
const Tarot = sequelize.define('tarotCard', {
  type: { type: Sequelize.STRING },
  name_short: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING, unique: true },
  value: { type: Sequelize.STRING },
  value_int: { type: Sequelize.INTEGER },
  meaning_up: { type: Sequelize.TEXT },
  meaning_rev: { type: Sequelize.STRING },
  desc: { type: Sequelize.TEXT }
});

const Horoscope = sequelize.define('horoscope', {
  date_range: { type: Sequelize.STRING },
  current_date: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  compatibility: { type: Sequelize.STRING },
  mood: { type: Sequelize.STRING },
  color: { type: Sequelize.STRING },
  lucky_number: { type: Sequelize.STRING },
  lucky_time: { type: Sequelize.STRING }
});

const Quotes = sequelize.define('quote', {
  _id: { type: Sequelize.STRING },
  content: { type: Sequelize.STRING, unique: true },
  author: { type: Sequelize.STRING },
});

const TimeLine = sequelize.define('timeline', {
  post: { type: Sequelize.STRING },
  user_id: { type: Sequelize.INTEGER }
});

// TimeLine.belongsTo(User, { foreignKey: 'user_id' });

const fetchTarotCards = () => {
  axios.get('https://tarot-api.onrender.com/api/v1/cards')
    .then(response => {
      console.log('<-- FROM TAROT API -->'); // response.data.cards
      Tarot.bulkCreate(response.data.cards)
        .then(bulk => {
          console.log('<-- DATABASE --> BULK CREATED TAROT TABLE');
        })
        .catch(err => {
          console.log('<-- DATABASE --> ERROR BULK CREATE TAROT TABLE', err);
        });
    })
    .catch(err => {
      console.log('<-- API --> ERROR FROM TAROT API', err);
    });
};


// <-- might not need to be async -->
const seeder = async () => {
  console.log('the seeder function was invoked');
  await sequelize.sync({ force: true });
  await User.bulkCreate([
    {
      name: 'Francis',
      dob: '01/19',
      sign: 'Aquarius'
    },
    {
      name: 'Jessica',
      dob: '03/20',
      sign: 'Pisces'
    },
    {
      name: 'Nicole',
      dob: '05/30',
      sign: 'Gemini'
    },
    {
      name: 'Carlos',
      dob: '11/11',
      sign: 'Scorpius'
    }
  ])
    .then(() => { console.log('User Model Create Success'); })
    .catch((err) => { console.error('User Model Create Failure', err); });
  await TimeLine.bulkCreate([
    {
      post: 'Hello everyone',
      user_id: 1
    },
    {
      post: 'the world is mystifying',
      user_id: 2
    },
    {
      post: 'I was here!!!',
      user_id: 3
    },
    {
      post: 'Begin again =)',
      user_id: 4
    }
  ])
    .then(() => { console.log('Created Post'); })
    .catch((err) => { console.error('Failed to create Post', err); });
  fetchTarotCards();
  /*await Quotes.create()
    .then(() => { console.log('Quote Model Create Success'); })
    .catch((err) => { console.error('Quote Model Create Failure', err); });

  console.log('Database seeded with a test quote table and data');
  */
};

module.exports.Tarot = Tarot;
module.exports.User = User;
module.exports.Quotes = Quotes;
module.exports.TimeLine = TimeLine;
module.exports.sequelize = sequelize;
module.exports.seeder = seeder;
