/**
 * END-TO-END ENCRYPTION UTILITIES
 * Uses Web Crypto API for RSA-OAEP (Key Exchange) and AES-GCM (Message Encryption)
 */

export const KEY_PAIR_ALGO = {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
}

export const AES_ALGO = {
    name: "AES-GCM",
    length: 256,
}

/**
 * Generates a new RSA Key Pair for the user
 */
export async function generateChatKeyPair() {
    const keyPair = await window.crypto.subtle.generateKey(
        KEY_PAIR_ALGO,
        true, // extractable
        ["encrypt", "decrypt"]
    )

    const publicKeyJWK = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey)
    const privateKeyJWK = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey)

    return {
        publicKey: publicKeyJWK,
        privateKey: privateKeyJWK
    }
}

/**
 * Encrypts a message for a specific recipient using their Public Key
 */
export async function encryptMessage(content: string, recipientPublicKeyJWK: JsonWebKey) {
    // 1. Generate a symmetric AES key for this message (performance)
    const messageKey = await window.crypto.subtle.generateKey(
        AES_ALGO,
        true,
        ["encrypt", "decrypt"]
    )

    // 2. Encrypt the content with AES
    const encoder = new TextEncoder()
    const encodedContent = encoder.encode(content)
    const iv = window.crypto.getRandomValues(new Uint8Array(12)) // Initialization Vector

    const encryptedContent = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        messageKey,
        encodedContent
    )

    // 3. Encrypt the AES key with the Recipient's RSA Public Key
    const importedPublicKey = await window.crypto.subtle.importKey(
        "jwk",
        recipientPublicKeyJWK,
        KEY_PAIR_ALGO,
        true,
        ["encrypt"]
    )

    const exportedMessageKey = await window.crypto.subtle.exportKey("raw", messageKey)
    const encryptedKey = await window.crypto.subtle.encrypt(
        KEY_PAIR_ALGO,
        importedPublicKey,
        exportedMessageKey
    )

    // 4. Return the package
    return {
        encryptedContent: b64Encode(encryptedContent),
        encryptedKey: b64Encode(encryptedKey),
        iv: b64Encode(iv)
    }
}

/**
 * Decrypts a message using the user's Private Key
 */
export async function decryptMessage(
    payload: { encryptedContent: string, encryptedKey: string, iv: string },
    userPrivateKeyJWK: JsonWebKey
) {
    try {
        // 1. Import Private Key
        const privateKey = await window.crypto.subtle.importKey(
            "jwk",
            userPrivateKeyJWK,
            KEY_PAIR_ALGO,
            true,
            ["decrypt"]
        )

        // 2. Decrypt the AES Key
        const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
            KEY_PAIR_ALGO,
            privateKey,
            b64Decode(payload.encryptedKey)
        )

        const aesKey = await window.crypto.subtle.importKey(
            "raw",
            decryptedKeyBuffer,
            AES_ALGO,
            true,
            ["decrypt"]
        )

        // 3. Decrypt the content
        const decryptedContentBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: b64Decode(payload.iv) },
            aesKey,
            b64Decode(payload.encryptedContent)
        )

        const decoder = new TextDecoder()
        return decoder.decode(decryptedContentBuffer)
    } catch (e) {
        console.error("Decryption failed:", e)
        return "[Error: Decryption Failed. Check Key Integrity.]"
    }
}

// Helpers for Base64 (Web Crypto uses ArrayBuffers)
function b64Encode(buffer: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

function b64Decode(str: string) {
    const binary = atob(str)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
}
