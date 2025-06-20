// src/services/EncryptionService.ts

/**
 * Represents the structure of the encrypted data payload.
 */
interface EncryptedPayload {
  iv: string; // Base64 encoded Initialization Vector
  ciphertext: string; // Base64 encoded ciphertext
}

// IMPORTANT: In a real-world application, this key MUST be managed securely.
// For this demo, we are using a fixed key for simplicity. This is NOT secure for production.
// A robust solution would involve deriving a key using a KDF (Key Derivation Function)
// from a user password, or using a backend service for key management.
const FIXED_KEY_MATERIAL = 'this-is-a-fixed-key-material-32'; // Must be 32 bytes for AES-256

/**
 * Derives a CryptoKey from the fixed key material.
 * In a real application, this would be more complex and secure.
 */
async function getKey(): Promise<CryptoKey> {
  const keyMaterial = new TextEncoder().encode(FIXED_KEY_MATERIAL);
  return window.crypto.subtle.importKey(
    'raw',
    keyMaterial,
    { name: 'AES-GCM' },
    false, // not extractable
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data using AES-GCM.
 * @param data The string data to encrypt.
 * @returns A Promise that resolves to a JSON stringified object containing the
 *          Base64-encoded IV and ciphertext.
 */
export async function encryptData(data: string): Promise<string> {
  const key = await getKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for AES-GCM is recommended

  const encodedData = new TextEncoder().encode(data);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encodedData
  );

  const payload: EncryptedPayload = {
    iv: btoa(String.fromCharCode(...iv)), // Convert Uint8Array to Base64 string
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))), // Convert ArrayBuffer to Base64 string
  };

  return JSON.stringify(payload);
}

/**
 * Decrypts data using AES-GCM.
 * @param encryptedDataJSON The JSON string (from encryptData) containing the IV and ciphertext.
 * @returns A Promise that resolves to the decrypted plaintext string.
 * @throws Error if decryption fails (e.g., wrong key, corrupted data).
 */
export async function decryptData(encryptedDataJSON: string): Promise<string> {
  const key = await getKey();
  let payload: EncryptedPayload;

  try {
    payload = JSON.parse(encryptedDataJSON);
  } catch (error) {
    console.error('Failed to parse encrypted data JSON:', error);
    throw new Error('Invalid encrypted data format.');
  }

  // Convert Base64 IV back to Uint8Array
  const ivString = atob(payload.iv);
  const iv = new Uint8Array(ivString.length);
  for (let i = 0; i < ivString.length; i++) {
    iv[i] = ivString.charCodeAt(i);
  }

  // Convert Base64 ciphertext back to ArrayBuffer
  const ciphertextString = atob(payload.ciphertext);
  const ciphertextBytes = new Uint8Array(ciphertextString.length);
  for (let i = 0; i < ciphertextString.length; i++) {
    ciphertextBytes[i] = ciphertextString.charCodeAt(i);
  }
  const ciphertext = ciphertextBytes.buffer;

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption failed:', error);
    // It's crucial to handle decryption errors properly.
    // For example, clear the corrupted data from storage or notify the user.
    throw new Error('Failed to decrypt data. The key might be incorrect or the data corrupted.');
  }
}

/*
Security Considerations for this Simplified Implementation:

1.  Key Management:
    -   The current implementation uses a FIXED_KEY_MATERIAL string directly embedded in the code.
        This is highly insecure for any real application.
    -   In a production environment, cryptographic keys must be:
        *   Generated securely.
        *   Stored securely (e.g., using browser's `CryptoKey` storage if non-extractable, or managed by a backend service).
        *   Derived using a strong Key Derivation Function (KDF) like PBKDF2 or Argon2 if based on user passwords.
        *   Rotated periodically.

2.  Initialization Vector (IV):
    -   The IV is generated randomly for each encryption, which is good practice for AES-GCM.
    -   It does not need to be secret but must be unique for each message encrypted with the same key.
    -   Storing it alongside the ciphertext (as done here) is a common and acceptable practice.

3.  Algorithm Choice:
    -   AES-GCM is a good choice for authenticated encryption, providing both confidentiality and integrity.

4.  Error Handling:
    -   The `decryptData` function includes basic error handling for parsing and decryption.
    -   Robust applications should have more sophisticated error handling, potentially including mechanisms
        to clear corrupted data or guide the user.

5.  Data Encoding:
    -   Base64 encoding is used to store binary data (IV and ciphertext) as strings in JSON. This is standard.
    -   UTF-8 encoding is used for the plaintext, which is also standard.

6.  Scope:
    -   This service is intended for client-side encryption of data at rest (e.g., in localStorage).
    -   It does not protect data in transit (which requires HTTPS) or data while it's being processed in memory.

This implementation provides a basic demonstration of using the Web Crypto API.
For production systems, consult security best practices and consider using established cryptographic libraries
or services that handle many of these complexities.
*/
