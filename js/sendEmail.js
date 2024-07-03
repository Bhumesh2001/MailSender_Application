const socket = io('http://localhost:5000');

let log = document.getElementById('log');
let ptag = document.createElement('p');

function generateRandomRoomName(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    };
    return result;
};
const randomRoomName = generateRandomRoomName(8);
console.log(randomRoomName);
socket.emit('join',randomRoomName);

socket.on('connect', () => {
    console.log('Connected to the server');
});

socket.on('log', (message) => {
    const Ptag = document.createElement('p');
    if (message.success) {
        Ptag.textContent = message.mesg;
        log.appendChild(Ptag);
    } else {
        Ptag.textContent = message.mesg;
        Ptag.classList.add('text-danger');
        log.appendChild(Ptag);
    };
});

socket.on('disconnect', () => {
    console.log('Disconnected from the server');
});

document.getElementById('myForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    let formData = {
        email: document.querySelector('#exampleInputEmail1').value,
        app_pass: document.querySelector('#exampleInputPassword1').value,
        hr_emails: document.querySelector('#exampleInputEmail2').value,
        subject: document.querySelector('#subject').value,
        body: document.querySelector('#body').value,
    };

    const button = document.getElementById('my-btn');
    const spinner = document.getElementById('spinner');
    const buttonText = document.getElementById('btn-text');
    const show_result = document.getElementById('show-mail');
    const mail_msg = document.getElementById('w-msg');

    button.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.style.display = 'none';

    let file = document.getElementById('resume').files[0];
    if (file !== undefined) {
        const reader = new FileReader();
        async function handleBase64Data(data, fileName, fileType) {
            const form_data = {
                ...formData,
                data,
                fileName,
                fileType
            };
            sendDataToServer(form_data);
        };
        reader.onload = function () {
            const base64Data = reader.result.split(',')[1];
            handleBase64Data(base64Data, file.name, file.type);
        };
        reader.readAsDataURL(file);
    } else {
        await sendDataToServer(formData);
    };
    async function sendDataToServer(formData) {
        let response = await fetch('http://localhost:5000/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        });
        const res = await response.json();
        if (res.success) {
            button.disabled = false;
            spinner.style.display = 'none';
            buttonText.style.display = 'inline-block';

            mail_msg.textContent = `${res.mailCount} mail has been sent.`;
            show_result.classList.remove('d-none');
            show_result.classList.add('d-block');
        } else {
            console.log(res.error);
        };
    };
});
