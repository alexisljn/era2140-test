function generateMessageToSign(address: string) {
    return `I will prove by signing this message that I own ${address}`;
}

export {generateMessageToSign}