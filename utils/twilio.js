const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTHTOKEN;
const serviceSID = process.env.TWILIO_SERVICE_SID;
const emailServiceSID = process.env.TWILIO_EMAIL_SERVICE_SID;
var client = require('twilio')(accountSID, authToken);

let host = ''
if(process.env.NODE_ENV === "development"){
  host = "http://localhost:3000"
}else if(process.env.NODE_ENV === "staging"){
  host = "https://staging.waterpin.com"
}else{
  host = "https://waterpin.com"
}

const sendEmailVerificationCode = async ({ email }) => {
	return new Promise((resolve, reject) => {
		client.verify
			.services(emailServiceSID)
			.verifications.create({
				to: `${email}`,
				channel: 'email',
			})
			.then(data => {
				resolve(data);
			})
			.catch(function (error) {
        console.log(error)
				reject('unable to send verification email.');
			});
	});
};

const sendPhoneVerificationCode = async ({ phone }) => {
	return new Promise((resolve, reject) => {
		client.verify
			.services(serviceSID)
			.verifications.create({
				to: `+${phone}`,
				channel: 'sms',
			})
			.then(data => {
				resolve(data);
			})
			.catch(function (error) {
        console.log(error)
				reject(error);
			});
	});
};

const verifyPhoneVerificationCode = async ({ phone, code }) => {
	return new Promise((resolve, reject) => {
		client.verify
			.services(serviceSID)
			.verificationChecks.create({
				to: `+${phone}`,
				code: code,
			})
			.then(data => {
				if (data.status === 'approved') {
					resolve(data);
				} else {
					resolve(data);
				}
			})
			.catch(error => {
        console.log(error)
				reject(error);
			});
	});
};

const verifyEmailVerificationCode = async ({ email, code }) => {
	return new Promise((resolve, reject) => {
		client.verify
			.services(emailServiceSID)
			.verificationChecks.create({
				to: `${email}`,
				code: code,
			})
			.then(data => {
				resolve(data);
			})
			.catch(error => {
        console.log(error)
				reject(error);
			});
	});
};

const sendInviteSMS = async ({ phone_number, referrer_id, inviter }) => {
	return new Promise((resolve, reject) => {
		client.messages
      .create({body: `${inviter} has invited you to Waterpin, a platform for renting boats, yachts, and exploring water activities across the globe. Click the link below to join for free! ${host}/signup?referrer_id=${referrer_id}`, from: '+13142082716', to: phone_number})
			.then(data => {
				resolve(data);
			})
			.catch(error => {
        console.log(error)
				reject(error);
			});
	});
};

module.exports = {
	sendEmailVerificationCode,
	verifyEmailVerificationCode,
	sendPhoneVerificationCode,
	verifyPhoneVerificationCode,
  sendInviteSMS
};
