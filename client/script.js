import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = 'wait cunt'

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

if(document.cookie.indexOf('credit=') < 0){
    document.cookie = "credit" + "=" + 15 + ";" + "Thu, 18 Dec 2023 12:00:00 UTC" + ";path=/";
}

document.getElementById("remaining").innerHTML = "Remaining daily questions: " + getCookie();

function getCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; credit=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    
  }

function setCookies(credit){
    if(getCookie() <= 0){
        document.cookie = "credit" + "=" + 0 + ";" + "Thu, 18 Dec 2023 12:00:00 UTC" + ";path=/";
    } else{
        document.cookie = "credit" + "=" + credit + ";" + "Thu, 18 Dec 2023 12:00:00 UTC" + ";path=/";
    }
    
    remaining();

}




function remaining()
{
        document.getElementById("remaining").innerHTML = "Remaining daily questions: " + getCookie();      
}

function chatStripe(isAi, value, uniqueId) {
    remaining();

    setCookies(getCookie()-0.5);       
    if(getCookie() > 0){
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    
                     
                
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
    }else{
        return(
            `
            <div class="wrapper 'ai'}">
                <div class="chat">
                    <div class="profile">
                        
                         
                    
                    </div>
                    <div class="message">You are out of daily questions, get unlimited access and more for $1 on <a href="https://www.patreon.com/evilbotai">Patreon</a></div>
                </div>
            </div>
        `
            )
    } 
    Console.debug(value + " " + uniqueId);

}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('https://evilbotv1a.onrender.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong"
        alert("error, probably that idiot clonaz fkd up something")
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})
