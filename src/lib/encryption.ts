export async function generateKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}

export async function encryptData(data: any, password: string): Promise<{ encrypted: string; salt: string; iv: string }> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await generateKey(password, salt);
    const enc = new TextEncoder();
    const encodedData = enc.encode(JSON.stringify(data));

    const encryptedContent = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedData
    );

    return {
        encrypted: Buffer.from(encryptedContent).toString('base64'),
        salt: Buffer.from(salt).toString('base64'),
        iv: Buffer.from(iv).toString('base64')
    };
}

export async function decryptData(encryptedData: string, password: string, saltStr: string, ivStr: string): Promise<any> {
    const salt = new Uint8Array(Buffer.from(saltStr, 'base64'));
    const iv = new Uint8Array(Buffer.from(ivStr, 'base64'));
    const encryptedContent = new Uint8Array(Buffer.from(encryptedData, 'base64'));

    const key = await generateKey(password, salt);

    const decryptedContent = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedContent
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decryptedContent));
}
