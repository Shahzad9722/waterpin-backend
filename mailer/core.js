const dotenv = require('dotenv').config();
const client = require('@sendgrid/mail');


client.setApiKey(process.env.SENDGRID_API_KEY);

/*------------------SMTP Over-----------------------------*/
// Send Email verification code while signup
const sendEmailVerificationCode = async ({ recipient_email, recipient_name }) => {

  const message = {
    template_id:1,
    personalizations: [
      {
        to: [
          {
            email: 'john_doe@example.com',
            name: 'John Doe',
            dynamic_template_data:{

            }
          }
        ],
      }
    ],
    from: {
      email: 'support@waterpin.com',
      name: 'Verify Your Email Account'
    },
    replyTo: {
      email: 'support@waterpin.com',
      name: 'Verify Your Email Account'
    },
    subject: 'Verify Your Email Account',
    ipPoolName: 'transactional-email',
    mailSettings: {
      bypassListManagement: {
        enable: false
      },
      footer: {
        enable: false
      },
      sandboxMode: {
        enable: false
      }
    },
    trackingSettings: {
      clickTracking: {
        enable: true,
        enableText: false
      },
      openTracking: {
        enable: true,
        substitutionTag: '%open-track%'
      },
      subscriptionTracking: {
        enable: false
      }
    }
  };


  return new Promise((resolve, reject) => {
    client
      .send(message)
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        console.log(error)
        reject(error);
      });
  });

};


const sendEmailInvite = async ({ recipient_email, inviter }) => {

  const message = {
    template_id:'d-35ec98897a43485db6dfcd998a995a10',
    personalizations: [
      {
        to: [
          {
            email: recipient_email,
            name: 'John Doe',
            dynamic_template_data:{
              "recipient_name": inviter
            }
          }
        ],
      }
    ],
    from: {
      email: 'support@waterpin.com',
      name: 'Verify Your Email Account'
    },
    replyTo: {
      email: 'support@waterpin.com',
      name: 'Verify Your Email Account'
    },
    subject: 'Verify Your Email Account',
    ipPoolName: 'transactional-email',
    mailSettings: {
      bypassListManagement: {
        enable: false
      },
      footer: {
        enable: false
      },
      sandboxMode: {
        enable: false
      }
    },
    trackingSettings: {
      clickTracking: {
        enable: true,
        enableText: false
      },
      openTracking: {
        enable: true,
        substitutionTag: '%open-track%'
      },
      subscriptionTracking: {
        enable: false
      }
    }
  };


  return new Promise((resolve, reject) => {
    client
      .send(message)
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
	sendEmailInvite
};


// Send Email verification code while signup
// sendForgotPasswordEmailVerificationCode: function (req, res) {
//     let body = req.body;
//     let code = Math.floor((Math.random() * 1000000) + 1000);
//     var data = {};
//     data.from = {};
//     data.from.email = beeyondBoat.onQuestEmailFrom;
//     data.from.name = "Reset Password";
//     data.personalizations = [];
//     data.personalizations[0] = {};
//     data.personalizations[0].to = [];
//     data.personalizations[0].to.push({'email' : body.email});
//     data.personalizations[0].dynamic_template_data = {};
//     data.personalizations[0].dynamic_template_data.code = code;
//     data.template_id = beeyondBoat.forgotPassword;
//     let dataResponse = {
//         response: {
//             verification_code : code
//         }
//     };
//     config.data = (data);
//     return new Promise((resolve, reject) => {
//         axios(config)
//         .then(function (response) {
//             resolve(dataResponse);
//         })
//         .catch(function (error) {
//             reject("unable to send verification email.");
//         });
//     });
//   },
//
// // Resend Email
// reSendEmailVerification: function (req, res) {
//     let body = req.body;
//     let code = Math.floor((Math.random() * 1000000) + 1000);
//     var data = {};
//     data.from = {};
//     data.from.email = beeyondBoat.onQuestEmailFrom;
//     data.from.name = "Reset Password";
//     data.personalizations = [];
//     data.personalizations[0] = {};
//     data.personalizations[0].to = [];
//     data.personalizations[0].to.push({'email' : body.email});
//     data.personalizations[0].dynamic_template_data = {};
//     data.personalizations[0].dynamic_template_data.code = code;
//     data.template_id = beeyondBoat.forgotPassword;
//     let dataResponse = {
//         response: {
//             verification_code : code
//         }
//     };
//     config.data = (data);
//     return new Promise((resolve, reject) => {
//         axios(config)
//         .then(function (response) {
//             resolve(dataResponse);
//             res.send(dataResponse);
//         })
//         .catch(function (error) {
//             reject("unable to send verification email.");
//         });
//     });
//   },
//
// // Welcome Email
// sendWelcomeEmail: function (req, res) {
//     let body = req;
//     console.log(body);
//     if (body.email == "") {
//         res.status(400).send({
//         message: "Email can not be empty!"
//         });
//     }
//     var data = {};
//     data.from = {};
//     data.from.email = beeyondBoat.onQuestEmailFrom;
//     data.from.name = "Welcome to OnQuest";
//     data.personalizations = [];
//     data.personalizations[0] = {};
//     data.personalizations[0].to = [];
//     data.personalizations[0].to.push({'email' : body.email});
//     data.personalizations[0].dynamic_template_data = {};
//     data.personalizations[0].dynamic_template_data.full_name = body.first_name;
//     data.template_id = beeyondBoat.welcomeTemplateID;
//     config.data = (data);
//     return new Promise((resolve, reject) => {
//         axios(config)
//         .then(function (response) {
//             resolve("Welcome Email sent");
//         })
//         .catch(function (error) {
//             reject("unable to send welcome email.");
//         });
//     });
//   },
//   // Welcome Email
//   sendInvoiceEmail: async function (req, callBack) {
//       let body = req;
//       console.log(body);
//       var data = {};
//       data.from = {};
//       data.from.email = beeyondBoat.onQuestEmailFrom;
//       data.from.name = "Your Grocery Shopping is complete! Here is your receipt. ";
//       data.personalizations = [];
//       data.personalizations[0] = {};
//       data.personalizations[0].to = [];
//       data.personalizations[0].to.push({'email' : body.email});
//       data.personalizations[0].dynamic_template_data = {};
//       data.personalizations[0].dynamic_template_data.full_name = body.name;
//       data.personalizations[0].dynamic_template_data.total_cost = body.total_amount;
//       var images = JSON.parse(body.payment_invoice.replace(/'/g,'"'));
//       for (var i=0; i < images.length; i++) {
//         data.personalizations[0].dynamic_template_data['image' + i] = images[i];
//       }
//       data.template_id = beeyondBoat.paymentGroceryEmail;
//
//       config.data = (data);
//         axios(config)
//         .then(function (response) {
//             callBack(true, "Invoice Email sent");
//         })
//         .catch(function (error) {
//             callBack(false, "unable to send invoice email.");
//         });
//     },
//     // Flower delivery invoice Email
//     sendInvoiceEmailFlowerDelivery: async function (req, callBack) {
//     let body = req;
//     var data = {};
//     data.from = {};
//     data.from.email = beeyondBoat.onQuestEmailFrom;
//     data.from.name = "Your Errands are done! Here is your receipt.";
//     data.personalizations = [];
//     data.personalizations[0] = {};
//     data.personalizations[0].to = [];
//     data.personalizations[0].to.push({'email' : body.email});
//     data.personalizations[0].dynamic_template_data = {};
//     data.personalizations[0].dynamic_template_data.full_name = body.name;
//     data.personalizations[0].dynamic_template_data.total_cost = body.total_amount;
//     var images = JSON.parse(body.payment_invoice.replace(/'/g,'"'));
//     for (var i=0; i < images.length; i++) {
//       data.personalizations[0].dynamic_template_data['image' + i] = images[i];
//     }
//     data.template_id = beeyondBoat.paymentFlowerDeliveryEmail;
//
//     config.data = (data);
//       axios(config)
//       .then(function (response) {
//           callBack(true, "Invoice Email sent");
//       })
//       .catch(function (error) {
//           callBack(false, "unable to send invoice email.");
//       });
//   },
//
//   // Rx pickup invoice Email
//   sendInvoiceRxPickup: async function (req, callBack) {
//     let body = req;
//     var data = {};
//     data.from = {};
//     data.from.email = beeyondBoat.onQuestEmailFrom;
//     data.from.name = "Your Errands are done! Here is your receipt.";
//     data.personalizations = [];
//     data.personalizations[0] = {};
//     data.personalizations[0].to = [];
//     data.personalizations[0].to.push({'email' : body.email});
//     data.personalizations[0].dynamic_template_data = {};
//     data.personalizations[0].dynamic_template_data.full_name = body.name;
//     data.personalizations[0].dynamic_template_data.total_cost = body.total_amount;
//     var images = JSON.parse(body.payment_invoice.replace(/'/g,'"'));
//     for (var i=0; i < images.length; i++) {
//       data.personalizations[0].dynamic_template_data['image' + i] = images[i];
//     }
//     data.template_id = beeyondBoat.paymentRxPickupEmail;
//
//     config.data = (data);
//       axios(config)
//       .then(function (response) {
//           callBack(true, "Invoice Email sent");
//       })
//       .catch(function (error) {
//           callBack(false, "unable to send invoice email.");
//       });
//   },
//
//  // custom Email
// sendCustomEmail: function (req, res) {
//     let body = req;
//     console.log(body);
//     if (body.email == "") {
//         res.status(400).send({
//         message: "Email can not be empty!"
//         });
//     }
//     let code = Math.floor((Math.random() * 1000000) + 1000);
//     var data = {};
//     data.from = {};
//     data.from.email = beeyondBoat.onQuestEmailFrom;
//     data.from.name = body.subject;
//     data.personalizations = [];
//     data.personalizations[0] = {};
//     data.personalizations[0].to = [];
//     data.personalizations[0].to.push({'email' : body.email});
//     data.personalizations[0].dynamic_template_data = {};
//     data.personalizations[0].dynamic_template_data.full_name = body.first_name;
//     data.personalizations[0].dynamic_template_data.message = body.message;
//     if(body && body.image != ''){
//         data.personalizations[0].dynamic_template_data.image = body.image;
//     }else{
//         data.personalizations[0].dynamic_template_data.image = "";
//     }
//     data.template_id = beeyondBoat.customEmail;
//     let dataResponse = {
//         response: {
//             verification_code : code
//         }
//     };
//     config.data = (data);
//     return new Promise((resolve, reject) => {
//         axios(config)
//         .then(function (response) {
//             resolve("Email sent");
//         })
//         .catch(function (error) {
//             reject("unable to send email.");
//         });
//     });
//   },
//
// // meet and greet Email
// meetAndGreetEmail: function (req, res) {
//     let body = req[0];
//     if (body.email == "") {
//         res.status(400).send({
//         message: "Email can not be empty!"
//         });
//     }
//     var date = new Date();
//     var serviceDate = new Date(date||new Date());
//     var currentDay = serviceDate.getDay();
//     let meet_and_greet_data = body.meet_greet_date_time;
//     if(currentDay == meet_and_greet_data){
//         meet_and_greet_data = serviceDate;
//     }else{
//         meet_and_greet_data = serviceDate.setDate(serviceDate.getDate() + (meet_and_greet_data - 1 - serviceDate.getDay() + 7) % 7 + 1);
//         meet_and_greet_data = new Date(meet_and_greet_data).toLocaleDateString("en-US")
//     }
//     var data = {};
//     data.from = {};
//     data.from.email = beeyondBoat.onQuestEmailFrom;
//     data.from.name = "OnQuest";
//     data.personalizations = [];
//     data.personalizations[0] = {};
//     data.personalizations[0].to = [];
//     data.personalizations[0].to.push({'email' : body.email});
//     data.personalizations[0].dynamic_template_data = {};
//     data.personalizations[0].dynamic_template_data.full_name = body.first_name;
//     data.personalizations[0].dynamic_template_data.captain_name = body.captain_name;
//     data.personalizations[0].dynamic_template_data.meetTime = body.meet_greet_date_time;
//     data.template_id = beeyondBoat.meetAndGreetEmail;
//     config.data = (data);
//     return new Promise((resolve, reject) => {
//         axios(config)
//         .then(function (response) {
//             resolve(req);
//         })
//         .catch(function (error) {
//             reject("unable to send email.");
//         });
//     });
//   }
