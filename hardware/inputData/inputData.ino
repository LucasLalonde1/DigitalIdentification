#include <Wire.h>
#include <Adafruit_PN532.h> 
#include <mbedtls/aes.h>     // Encryption

// Encryption key 256 bits (32 hex)
unsigned char aes_key[32] = {0x23, 0xB6, 0xA5, 0xC9, 0x01, 0xDE, 0x37, 0x1B, 0x4F, 0x90, 0xFF, 0x88, 0x21, 0x34, 0x67, 0xAC,
                             0x1A, 0x9B, 0x23, 0xCD, 0xEF, 0x12, 0x45, 0x67, 0x89, 0x0B, 0x4D, 0x3F, 0x8E, 0xA2, 0x56, 0x9C};

// Define I2C pins for ESP32
#define SDA_PIN 21
#define SCL_PIN 22

Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

// The encrypted and decrypted data buffers
uint8_t encrypted_data[16];
uint8_t decrypted_data[16];

// Function to manually pad the data using PKCS#7
void pkcs7_pad(uint8_t* input, size_t input_length, uint8_t* output, size_t block_size) {
    size_t padding_length = block_size - (input_length % block_size);
    for (size_t i = 0; i < input_length; i++) {
        output[i] = input[i];
    }
    for (size_t i = input_length; i < input_length + padding_length; i++) {
        output[i] = padding_length; // Fill with the length of the padding
    }
}

// Encrypt the data using AES-256
void encryptAES(uint8_t* input, uint8_t* output, uint8_t* key) {
    mbedtls_aes_context aes;
    mbedtls_aes_init(&aes);
    mbedtls_aes_setkey_enc(&aes, key, 256);  // Set key for encryption
    mbedtls_aes_crypt_ecb(&aes, MBEDTLS_AES_ENCRYPT, input, output);  // Encrypt using ECB mode
    mbedtls_aes_free(&aes);
}

// Decrypt the data using AES-256
void decryptAES(uint8_t* input, uint8_t* output, uint8_t* key) {
    mbedtls_aes_context aes;
    mbedtls_aes_init(&aes);
    mbedtls_aes_setkey_dec(&aes, key, 256);  // Set key for decryption
    mbedtls_aes_crypt_ecb(&aes, MBEDTLS_AES_DECRYPT, input, output);  // Decrypt
    mbedtls_aes_free(&aes);
}

// Function to write encrypted data to NFC card
void writeEncryptedDataToBlock4(uint8_t* licenseData, size_t length) {
    uint8_t success;
    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
    uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on the card)

    // Wait for an NFC card
    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

    if (success) {
        Serial.println("Card Detected");

        // Authenticate block 4
        if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, (uint8_t*)"\xFF\xFF\xFF\xFF\xFF\xFF")) {
            Serial.println("Authenticated Block 4");

            // Allocate a buffer for padded data
            uint8_t padded_data[16];
            pkcs7_pad(licenseData, length, padded_data, sizeof(padded_data));

            // Encrypt the padded data before writing
            encryptAES(padded_data, encrypted_data, aes_key);

            // Write encrypted data to block 4
            if (nfc.mifareclassic_WriteDataBlock(4, encrypted_data)) {
                Serial.println("Successfully wrote encrypted data to Block 4");
            } else {
                Serial.println("Failed to write encrypted data to Block 4");
            }
        } else {
            Serial.println("Failed to authenticate block 4");
        }
    }
}

// Function to read and decrypt data from NFC card
void readAndDecryptDataFromBlock4() {
    uint8_t success;
    uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
    uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on the card)

    // Wait for an NFC card
    success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

    if (success) {
        Serial.println("Card Detected");

        // Authenticate block 4
        if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, (uint8_t*)"\xFF\xFF\xFF\xFF\xFF\xFF")) {
            Serial.println("Authenticated Block 4");

            // Read encrypted data from block 4
            uint8_t read_data[16];
            if (nfc.mifareclassic_ReadDataBlock(4, read_data)) {
                Serial.println("Successfully read encrypted data from Block 4");

                // Decrypt the data after reading
                decryptAES(read_data, decrypted_data, aes_key);

                // Print the decrypted data to verify it matches the original
                Serial.print("Decrypted Data: ");
                for (uint8_t i = 0; i < 16; i++) {
                    Serial.print((char)decrypted_data[i]);
                }
                Serial.println();
                
                // Optionally, trim trailing padding if they exist
                size_t padding_length = decrypted_data[15]; // The value in the last byte indicates the padding length
                for (size_t i = 15; i > 15 - padding_length; i--) {
                    decrypted_data[i] = 0; // Null terminate for proper string output
                }

                // Print the trimmed decrypted data
                Serial.print("Trimmed Decrypted Data: ");
                Serial.println((char*)decrypted_data);
            } else {
                Serial.println("Failed to read Block 4");
            }
        } else {
            Serial.println("Failed to authenticate block 4");
        }
    }
}

void setup(void) {
    Serial.begin(115200);
    
    // Initialize NFC
    nfc.begin();
    uint32_t versiondata = nfc.getFirmwareVersion();
    if (!versiondata) {
        Serial.println("Didn't find PN532 module");
        while (1);
    }
    nfc.SAMConfig();  // Configure NFC reader

    // Example license data input
    uint8_t licenseData[16] = {'1', '2', '3', '4', '5', '6', '7', '8', '9', 0, 0, 0, 0, 0, 0}; // Input your custom string here
    size_t length = 10; // Length of the string without padding

    // Write encrypted data to the NFC card
    writeEncryptedDataToBlock4(licenseData, length);

    // Read and decrypt data from the NFC card to verify
    readAndDecryptDataFromBlock4();
}

void loop() {
    // Nothing needed in the loop for now
}
