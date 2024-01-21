const cron = require('node-cron');
const client = require("../database/db");
const database = client.db('openinapp');
const collections = {
  task: database.collection('task')
}

const updateTasksPriority = async() => {
  console.log('Running cron job to update priority of tasks at:', new Date().toLocaleString());
  
  try {
    const tasks = await collections.task.find({ deleted: { $exists: false } }).toArray();
    let updateCount = 0;

    for (const task of tasks) {
      const difference = task.due_date - new Date().getTime();
      const noOfDaysLeft = difference / 86400000;
      let priority;

      if (noOfDaysLeft >= 5) priority = 3;
      else if (noOfDaysLeft >= 3) priority = 2;
      else if (noOfDaysLeft >= 1) priority = 1;
      else if (noOfDaysLeft >= 0) priority = 0;
      else priority = -1;  // -1 indicates that the task has passed its due_date

      await collections.task.updateOne({ _id: task._id }, { $set: { priority } });
      updateCount++;
    }

    console.info("Update document count - ", updateCount);

  } catch (error) {
    console.error(error.message);
  }
};

// Schedule the task using cron syntax (every 10 seconds in this example)
cron.schedule('*/10 * * * * *', updateTasksPriority);
