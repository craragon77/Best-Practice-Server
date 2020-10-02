Best Practice is a fullstack program meant for musicians to better structure, organize, and plan their rehearsals.
Best Practice allows users to add the songs that they are practicing to their repoitoire, as well as log how long and how frequently they practice their music. Best Practice also records a user's practice history until said song is deleted to get a true picture of your practice habits so that time can be better managed and practice can be more productive. Its the ideal program for musicians who need support managing how they practice music.

live database: 'https://floating-oasis-69205.herokuapp.com'

![snapshot large screen](https://github.com/craragon77/Best-Practice-Client/blob/master/src/readme-pics/screenshot1.png)

To use Best Practice's server, simply make an account with a valid username and password, then log in. Users will be assigned a unique UUID, which can then be used to make fetch requests and queries to the backend. Users can expect a fast response given a valid UUID and if request parameters are met. If the UUID is invalid or if the parameters are not met, a custom response will be sent with a 400 response to the client. If what you are looking for cannot be found, a custom response and a 404 response will be sent to the client.

![snapshot medium screen](https://github.com/craragon77/Best-Practice-Client/blob/master/src/readme-pics/screenshot2.png)

The backend for the program was built with Node.js, Mocha, Chai, and PostgreSQL. To deploy, simply clone the code and type "npm start" or "npm run dev" into the command line. To view the client repository, it is available here: https://github.com/craragon77/Best-Practice-Client

![snapshot small screen](https://github.com/craragon77/Best-Practice-Client/blob/master/src/readme-pics/screenshot4.png)

This program is dedicated to all musicians and artists who spend their free time devoted to improving their craft. Special thanks to my advisor Jaina Morgan for her support.