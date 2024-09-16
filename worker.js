var fs = require("fs");
const { ethers } = require("ethers");
var tries = 0, hits = 0;
const delay = time => new Promise(res => setTimeout(res, time));

// Load words from bip39.txt (make sure the file contains the BIP39 wordlist)
var words = fs.readFileSync("bip39.txt", { encoding: 'utf8', flag: 'r' })
    .replace(/(\r)/gm, "")  // Remove carriage returns
    .toLowerCase()  // Convert all words to lowercase
    .split("\n");  // Split the file content into an array of words

// Helper function to generate a random 12-word mnemonic
function gen12(words) {
    var shuffled = words.sort(() => 0.5 - Math.random());  // Shuffle the words randomly
    return shuffled.slice(0, 12).join(" ");  // Pick the first 12 words for the mnemonic
}

console.log("Starting...");

// Async function to generate wallet from mnemonic and log only the mnemonic and address
async function doCheck() {
    tries++;
    try {
        const mnemonic = gen12(words);  // Generate a random 12-word mnemonic
        const wallet = ethers.Wallet.fromMnemonic(mnemonic);  // Create a wallet from the mnemonic

        // Log only the wallet address and mnemonic to ahits.txt (no private key)
        fs.appendFileSync('ahits.txt', `${wallet.address}, ${mnemonic}\n`);
        hits++;
        process.stdout.write("+");  // Log success (wallet created)
    } catch (e) {
        // Handle any errors silently and move on
    }

    await delay(0);  // Prevent call stack overflow by adding a slight delay
    process.stdout.write("-");  // Log failure (wallet not created)
    doCheck();  // Recursively call doCheck to keep generating mnemonics
}

// Start the process
doCheck();
