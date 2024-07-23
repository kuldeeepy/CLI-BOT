import 'dotenv/config'
import axios from 'axios';
import readline from 'readline';

// Create a readline interface to read input from the CLI
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function generateText(prompt) {
    try {
        const response = await axios.post(process.env.CO_HERE, {
            prompt: prompt,
            max_tokens: 100
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Log the full response to debug
        // console.log('API Response:', response.data.text);

        // Extract text from the correct part of the response
        if (response.data && response.data.generations && response.data.generations[0]) {
            return response.data.generations[0].text.trim();
        } else {
            return 'No generated text found in the response.';
        }
    } catch (error) {
        console.error('Error generating text:', error);
        return 'An error occurred while generating text.';
    }
}

// Function to handle user input and generate text
function handleInput(input) {
    const messages = [
        { "role": "system", "content": "You are an intelligent DSA assistant, skilled in explaining complex programming concepts with creative flair. Be Concise and write less(use simpler words)." },
        { "role": "user", "content": input }
    ];

    const formattedPrompt = messages.map(msg => `${msg.role}: ${msg.content}`).join('\n') + '\n';
    
    generateText(formattedPrompt).then(response => {
        console.log('Generated Text:', response);
        promptUser(); // Prompt user for new input after showing the response
    });
}

// Function to prompt the user for input
function promptUser() {
    rl.question('Enter your message (or type "exit" to close): ', (input) => {
        if (input.toLowerCase() === 'exit') {
            rl.close(); // Close the readline interface if the user types 'exit'
            console.log('Goodbye!');
        } else {
            handleInput(input); // Handle the new input
        }
    });
}

// Start the interaction
console.log('Welcome to the CLI chatbot! Type "exit" to close.');
promptUser();
