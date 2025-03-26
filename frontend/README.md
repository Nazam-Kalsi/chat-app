# user

id, email, name, username, socketId, messages:[Message Schema]

## messages

reciever, sender, message


login : socketID assign

Add socketID to db as user logged in or refreshes the page. -D
create a room with the both userID's as name seperated by ' - ' , and join both the users in that room.
if user refreshes add their socket to same room and remove the older one.
