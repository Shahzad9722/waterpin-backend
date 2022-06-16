const UserRewards = require('../models/UserRewards');
const Rewards = require('../models/Rewards');

const checkNewRewards = async ({user_id}) => {
  const allRewards = await Rewards
    .query()
    .then(rewards => {return rewards})

  const userRewards = await UserRewards
    .query()
    .select('reward_id')
    .where('user_id','=', user_id)
    .then(userRewards => {return userRewards})

  let rewardsIDList = []
  allRewards.forEach((item, i) => {
    rewardsIDList.push(item.id)
  });

  let userRewardsIDList = []
  userRewards.forEach((item, i) => {
    userRewardsIDList.push(item.reward_id)
  });

  let rewardCreationList = []

  rewardsIDList.forEach((item, i) => {
    if (!userRewardsIDList.includes(item)) {
      rewardCreationList.push({user_id:user_id, reward_id:item, status:0, actionsCompleted:0})
    }
  });

  if (rewardCreationList.length > 0) {
    const userRewardsInsert = await UserRewards
      .query()
      .insert(rewardCreationList)
      .then(userRewards => {return userRewards})

    if (true) {
      return userRewardsInsert
    }else {
      return null
    }
  }  //console.log(allRewards)

}

module.exports = { checkNewRewards };
