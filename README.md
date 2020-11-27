# Mail
Mail is a single-page email client that makes API calls to send and receive emails. Single-page in the sense that, using
JavaScript and AJAX methods, the application loads data from the server-side without having to reload a page. It was built using Python (Django),
HTML, JavaScript, CSS.

### Project Description

After a user registers for a new account, the application allows the user to send and recieve emails. The application also allows a user to archivie
and unarchive messages. A pleasant feature of this application is the ability to carry out these actions without having to reload the page.

[views.py](/mail/views.py) defines the functions for all of the routes. The folder, [templates](/mail/templates/mail/), holds the front-end HTML files.
The emails you’ll be sending and receiving in this project will be entirely stored in a database, [db.sqlite3](/db.sqlite3). They won’t actually be
sent to real email servers, so you’re welcome to choose any email address (e.g. foo@example.com) and password you’d like for this application: credentials
need not be valid credentials for actual email addresses.

Aesthetics were not paramount in this project, just the concept of using AJAX methods was in focus.

A video of this application's demonstration is at https://youtu.be/6DKoBh-TEVE
