const UserRewards = require('../models/UserRewards')
const Rewards = require("../models/Rewards");
const User = require("../models/User")


const PointsTrigger = async (user, actionType) => {

    switch (actionType) {
        case 'invite-friends':
            await sendInvitationTrigger(user, actionType);
            break;
        case 'complete-profile':
            await completeProfileTrigger(user);
            break;
        case 'verify-account':
            await verifyAccountTrigger(user);
            break;
        case 'complete-trip':
            await completeTripTrigger(user);
            break;
        case 'leave-review':
            await leaveReviewTrigger(user);
            break;
        case '5-star-review':
            await fiveStarReviewTrigger(user);
            break;

    }

}






















const completeTripTrigger = async (userDat) => { }

const completeProfileTrigger = async (userData) => { }

const verifyAccountTrigger = async (userData) => { }
const leaveReviewTrigger = async (userData) => { }
const fiveStarReviewTrigger = async (userData) => { }



const sendInvitationTrigger = async (userData, actionType) => {
    //get the user Id
    const id = userData.id

//user rank
    const { rank } = userData;

    const reward = await Rewards.query()
        .where('rank', '=', rank)
        .where('reward_tag', '=', actionType)
        .then(rewards => {
            return rewards;
        });


    if (reward) {
        //grab the user_reward
        const reward_id = reward[0].id;
        const { actionsRequired } = reward[0]
        const userRewards = await UserRewards.query()
            .where('user_id', '=', id)
            .where('reward_id', '=', reward_id)
            .then(userRewards => {
                return userRewards;
            })

        let { actionsCompleted } = userRewards[0];
        //look at the actionCompleted
        actionsCompleted = actionsCompleted + 1;

        if (actionsCompleted <= actionsRequired) {


            //updated the userRewards table
            const userRewardUpdate = await UserRewards.query()
                .where('user_id', '=', id)
                .where('reward_id', '=', reward_id)
                .update({ 'actionsCompleted': actionsCompleted })
        }
    if (actionsCompleted == actionsRequired) {
            const { points } = reward[0]
            let userPoint = userData.points
            let updatePoints = points + userPoint;

            const userUpdate = await User.query()
                .where('id', '=', id)
            .update({ 'points': updatePoints })
        }
    }
}


module.exports = { PointsTrigger };
