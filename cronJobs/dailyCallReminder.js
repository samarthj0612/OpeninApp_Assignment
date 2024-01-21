const cron = require('node-cron');
const client = require("../database/db");
const { makeCall } = require('../twilio');
const database = client.db('openinapp');
const collections = {
  task: database.collection('task')
}

const dailyCallReminder = async() => {
  console.log('Running cron job to make calls at:', new Date().toLocaleString());
  
  try {
    const tasks = await collections.task.find({ deleted: { $exists: false } }, {projection: { mob: 1, idx: 1, _id: 0 }}).sort({ priority: -1 }).toArray();
    let successfullCallsCount = 0;

    for (const task of tasks) {
      makeCall(task.mob, (err) => {
        if(err){
          console.error("Something went wrong");
        }
        else 
          successfullCallsCount++;
      })
    }

    console.info("Calls successfully made - ", successfullCallsCount);

  } catch (error) {
    console.error(error.message);
  }
};

// Schedule the task using cron syntax (every 10 seconds in this example)
cron.schedule('*/10 * * * * *', dailyCallReminder);
