document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';


  // Function for form submission
  document.querySelector("#compose-form").onsubmit = () =>
    {
      const recipients = document.querySelector("#compose-recipients").value;
      const subject = document.querySelector("#compose-subject").value;
      const body = document.querySelector("#compose-body").value;

      // Submit mail
      fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent');
    });

    return false;
    };
}


function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Fetch mailbox
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(data =>
  {

      // If no emails in mailbox
      if (data.length == 0)
      {
        const div = document.createElement("div");
        div.innerHTML = "No mails";
        document.querySelector("#emails-view").append(div);
      }

      else
      {
        data.forEach( email => {

          const div = document.createElement("div");
          div.className = "email-bar";

          div.innerHTML = `<a style="color:black" href="#"><b class="mr-3">${email.sender}</b> ${email.subject} <span class="offset-3">${email.timestamp}</span></a>`;

          // if email is read
          if (email.read)
          {
            div.style.backgroundColor = "grey";
          }
          // When email is clicked
          div.addEventListener('click', () => view_email(email.id));

          document.querySelector("#emails-view").append(div);

        });
      }
  })
  .catch(error => console.log(error));
}



function view_email(email_id)
{
  // Show the email and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  // Mark email as read
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
    read: true
      })
  });

  // Fetch email
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(data =>
  {
      // To get current session user
      const user = document.querySelector("#user").innerHTML;
      // If sender of email is not user, show archive or unarchive button
      const archive = (data.sender !== user && !data.archived) ? document.createElement("button") : "";

      const unarchive = (data.sender !== user && data.archived) ? document.createElement("button") : "";


      if (archive)
      {
          archive.className = "btn btn-outline-primary";
          archive.innerHTML = "Archive";
          archive.id = "archive";
      }
      else if (unarchive)
      {
          unarchive.className = "btn btn-outline-primary";
          unarchive.innerHTML = "Unarchive";
          unarchive.id = "unarchive";
      }


      document.querySelector("#email-view").innerHTML = `<b>From</b>: ${data.sender} <br>
       <b>To</b>: ${data.recipients} <br>
       <b>Subject</b>: ${data.subject} <br>
       <b>Timestamp</b>: ${data.timestamp} <br>

       <div>
        <button id="reply" class="btn btn-outline-primary">Reply</button>
        <span id="arc"></span>
       </div>
       <hr>
       <b>Body</b>:<br>
       <div style="white-space: pre-line;">
        ${data.body}
        </div>`;

        document.querySelector("#arc").append(archive, unarchive);

        // For archiving and unarchiving email
        document.querySelector("#archive").addEventListener('click', () => {

          fetch(`/emails/${email_id}`, {
          method: 'PUT',
          body: JSON.stringify({
          archived: true
            })
        });
          load_mailbox("inbox");
        });

        document.addEventListener('click', event => {
            const element = event.target;
            if (element.id === 'unarchive') {
                fetch(`/emails/${email_id}`, {
              method: 'PUT',
              body: JSON.stringify({
              archived: false
                })
            });
              load_mailbox("inbox");
            }
        });

        // For replying
        document.addEventListener('click', event =>{
            const button = event.target;
            if (button.id == "reply")
            {
                reply_view(data);
            }
        });


  })
  .catch(error => console.log(error));
}


function reply_view(email)
{
    // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;


  // Function for form submission
  document.querySelector("#compose-form").onsubmit = () =>
    {
      const recipients = document.querySelector("#compose-recipients").value;
      const subject = document.querySelector("#compose-subject").value;
      const body = document.querySelector("#compose-body").value;

      // Submit mail
      fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent');
    });

    return false;
    };
}




