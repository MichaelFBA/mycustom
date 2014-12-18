// //GCM Push Notifications
// notificationClient = new NotificationClient({
//     senderId: 980680137067,
//     gcmAuthorization: "AIzaSyCWK0elthQwGLT8j3iP7zGeGFHZJ1ohdP0"
// })

// Meteor.methods({
//   'notify': function(title, message) {
//     return notificationClient.sendNotification(this.userId, {
//       title: title,
//       message: message
//     });
//   }
// })