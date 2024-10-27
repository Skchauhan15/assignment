# assignment

To run in local system 
1.clone the repository
2. run command in terminal 
   cd assignment 
   npm i - node should be pre required to run it.
3. create .env file to set environment variable
4. run command in terminal - npm run dev

About Project
This project have 3 main module.
1.User Module
2.Admin Module
3.Task Module

open api - link - 
for local system - http://localhost:5000/docs


USER Module
user/signup -- for signup process                 for user only
user/verify-email -- to verify email              for user and manager 
user/login - common api for login                 for all user, admin and management
user/logout  -  commmon api for logout            for all user, admin and management
user/profile - common api to get own profile      for user, admin and management
user/change/password - common api to change password   for all user, admin and manager
user/forget/password = common api for forget password   for all 
user/forget/verify/otp - common api to verify otp after forget password   for all
user/reset/password -   common api to reset password after verify the otp of forget password   for all
user/resend/otp - common api to resend otp                                        for all
user/other  --  only for manager and admin to get the users list        for manager and admin only


ADMIN Module
post - admin/manager - to create the manager role based access for admin only
get - admin/manger - to get the list of the manager  access for admin only
post - admin/team - to create the team  rbc - admin
get - admin/team - to get the list of the team  rbc - admin
get - admin/team/_id/member - to get the members of a team rbc -admin
patch - admin/team/_id/member/add -- to add a member in the team  --admin
patch - admin/team/_id/member/remove --to remove a member for the the team - admin


TASK Module
post -task - task create api   access only for - admin ,manager
get - task - task list api role base access for admin, manager and user 
             user get only assing task and use filter based on priority, status due_date and search 
             by title also
put - task/_id - task edit api role base access for admin, manager
get - task/_id - task detail api  role base access for admin, manager , user
delete - task/_id  delete task api  role base access for admin , manager
put - task/status/_id - to change the status of the task for admin , manager and user
                        on assign a task a email is send to the other if manger and admin change the status then email is sent to user, 
                         if user change the status then manger or admin (assign_by) is recieved the mail<
                        socket also hit from the backend socket name-  "taskAssigned" 
put - task/assign/_id - to assign the task to a user  for admin and manager user is recieved a mail on task assign.

Notice
* All the email is sent with the template with minimum text which can we rebuild as need.
* code written in js with express to remove complication to understand
* User api try to provide all flow of signup and login
* rate limit is applied 
* nodemailer is used to send email templates
* openapi version 3.3 is used
* all the task and user api is consumed with JOI validation
* twilio is setup but not used as its a paid service
* all the get api is provided with pagination and limit
* all password saved after hashing 



#env variable 
MONGO='mongodb://localhost:27017/assignment'
TOKEN_KEY="assignment"
EMAIL = 'sumit.k.henceforth@gmail.com'   // don't use personal creds everywhere
PASSWORD =         // 
MONGODB=mongodb://127.0.0.1:27017/assignment
ADMIN_DEFAULT_EMAIL="admin123@yopmail.com"
ADMIN_DEFAULT_PASSWORD="Admin123@"
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE=






