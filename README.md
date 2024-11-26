# digitalid

## There are 4 directories in this project...

1. **hardware**: This directory contains the code for an arduino (hardware end of things) and an NFC connection to it It also contains a file called inputData which a way to upload the data to the nfc card. The code is located in the .ino files. It sends a request to the DigitalId API to verify the users age / identity.

2. **digitalid**: This directory contains the backend API for handling the user verification from the hardware. It is built using django. Views.py contains most of the logic for the authentication and decrypting of the data.

3. **nsidmobile**: This directory contains the React Native mobile app that the user can login to. It communicates with the mobileapi backend via the functions in "api.js" to handle all user functions such as creating an account and logging in, as well as extracting user data like their cards and presenting it to them when the add their identity card.

This theoretically should communicate with the hardware via NFC as well when a user scans the terminal to verify the users identity. This was not implemented as it was a newly released feature by apple but I did not have access to the NFC.

4. **mobileapi**: This directory contains the code for the backend API that talks to the "nsidmobile" mobile app. It functions to create users, authenticate/login users, associate existing cards with users trying to add their card etc.

**venv** is a python virtual environment for the hardware api

**mobilevenv** is a python virtual environment for the mobile app api

