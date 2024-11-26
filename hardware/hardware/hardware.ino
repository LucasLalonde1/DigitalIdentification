#include <Wire.h>
#include <Adafruit_PN532.h>  // NFC reader
#include <WiFi.h>            // Wifi connection
#include <HTTPClient.h>      // API Communication
#include <LiquidCrystal.h>   // Display
#include <mbedtls/aes.h>     // Encryption
#include <ArduinoJson.h>
#include <base64.h>

// sudo chmod a+rw /dev/ttyUSB0

// Define I2C pins for ESP32
#define SDA_PIN 21
#define SCL_PIN 22

const int rs = 5, en = 18, d4 = 23, d5 = 4, d6 = 19, d7 = 15;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

// Wifi login
const char* ssid = "Phone";
const char* password = "aaaaaaaa";

// Use the actual IP of your Django server, not localhost
const char* apiUrl = "https://URL/api/drivers-license/";

const char* worldTimeApiUrl = "https://worldtimeapi.org/api/timezone/America/Halifax"; // Real time date

// Create the PN532 instance
Adafruit_PN532 nfc(SDA_PIN, SCL_PIN);

void setup(void) {
  Serial.begin(115200);  // Initialize serial communication

  // Initialize the LCD
  lcd.begin(16, 2);  // 16 columns and 2 rows
  lcd.clear();
  lcd.print("Connecting...");

  // Print SSID and password for debugging
  Serial.print("Connecting to SSID: ");
  Serial.println(ssid);
  Serial.print("Using password: ");
  Serial.println(password);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi...");

  int attempts = 0;
  // Retry until we are connected to WiFi
  while (WiFi.status() != WL_CONNECTED && attempts < 40) { 
    delay(1000);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to WiFi!");
    Serial.print("Local ESP32 IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nFailed to connect to WiFi");
    Serial.print("Status: ");
    Serial.println(WiFi.status());
  }

  // Initialize the PN532
  nfc.begin();

  // Check for PN532 firmware version
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (!versiondata) {
    Serial.println("Didn't find PN532 module");
    while (1)
      ;
  }

  // Print firmware version for debugging
  Serial.print("Found PN532 with firmware version: 0x");
  Serial.println(versiondata, HEX);

  // Configure the PN532 to read RFID cards
  nfc.SAMConfig();
  Serial.println("Waiting for an NFC card...");
  lcd.clear();
  lcd.print("Waiting for card");
}

void loop(void) {
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on the card)

  // Wait for an NFC card
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success) {
    lcd.clear();
    lcd.print("Card Detected");

    // Authenticate block 4 (where the license data is stored)
    if (nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, (uint8_t*)"\xFF\xFF\xFF\xFF\xFF\xFF")) {
      Serial.println("Authenticated Block 4");

      // Create a buffer to store the read data
      uint8_t encrypted_data[16];  // Encrypted data from block 4

      // Read block 4
      if (nfc.mifareclassic_ReadDataBlock(4, encrypted_data)) {
        Serial.println("Data in Block 4: ");
        for (uint8_t i = 0; i < 16; i++) {
          Serial.print(encrypted_data[i], HEX);  // Print encrypted data for debugging
          Serial.print(" ");
        }
        Serial.println();

        // Create a string to hold the decrypted data (assuming it's readable text)
        String formattedData = "";
        for (uint8_t i = 0; i < 16; i++) {
          formattedData += (char)encrypted_data[i];  // Assuming the encrypted data is a string
        }

        // Print the readable data to serial monitor and LCD
        Serial.print("Encrypted License Data: ");
        Serial.println(formattedData);
        lcd.clear();
        lcd.setCursor(0, 1);

        // Send the decrypted data to the Django API
        sendToAPI(formattedData);
      } else {
        Serial.println("Failed to read block 4.");
        lcd.clear();
        lcd.print("Read Block Err");
      }
    } else {
      Serial.println("Failed to authenticate block 4.");
      lcd.clear();
      lcd.print("Auth Failed");
    }

    delay(2000);  // Wait a bit before reading another card
  } else {
    // No card detected, update LCD
    lcd.setCursor(0, 0);
    lcd.print("Waiting for card");
  }

  delay(100);  // Small delay to avoid flooding the serial output
}

void sendToAPI(String licenseData) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String encodedLicenseData = base64::encode(licenseData);  // Base64 encode the encrypted data

    http.begin(apiUrl);  // Use the base URL
    http.addHeader("Content-Type", "application/json");

    // Create JSON payload
    String jsonPayload = "{\"license_data\": \"" + encodedLicenseData + "\"}";
    Serial.println("Sending JSON Payload: " + jsonPayload);

    int httpResponseCode = http.POST(jsonPayload);  // Send encoded data in the body
    Serial.println("httpReponseCode: " + httpResponseCode);

    // Check response and handle errors
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("API Response Code: " + String(httpResponseCode));
      Serial.println("API Response: " + response);

      // Create a JSON document and parse the response
      StaticJsonDocument<200> doc;  // Adjust the size as needed
      DeserializationError error = deserializeJson(doc, response);

      // Check for errors in parsing
      if (error) {
        Serial.println("Failed to parse JSON: " + String(error.c_str()));
        lcd.clear();
        lcd.print("JSON Parse Error");
        return;  // Exit the function if parsing failed
      }

      // Check for errors in the response
      if (doc.containsKey("error")) {
        String errorMsg = doc["error"];
        Serial.println("Error from API: " + errorMsg);
        lcd.clear();
        lcd.print("API Error: " + errorMsg);
        return;
      }

      // Extract the date of birth from the JSON document
      String dateOfBirth = doc["date_of_birth"];
      int birthYear = dateOfBirth.substring(0, 4).toInt();
      int birthMonth = dateOfBirth.substring(5, 7).toInt();
      int birthDay = dateOfBirth.substring(8, 10).toInt();

      // Get current date from WorldTime API
      String datetime = getCurrentDateTime(); // Modify this to return the current datetime as a string
      if (datetime.length() == 0) {
        Serial.println("Failed to get current date and time.");
        lcd.clear();
        lcd.print("DateTime Error");
        return;
      }

      int currentYear = datetime.substring(0, 4).toInt();
      int currentMonth = datetime.substring(5, 7).toInt();
      int currentDay = datetime.substring(8, 10).toInt();

      // Calculate age
      int age = calculateAge(birthYear, birthMonth, birthDay, currentYear, currentMonth, currentDay);

      // Display age on LCD
      lcd.clear();
      lcd.print("User Authenticated...");
      lcd.setCursor(0, 1);  // Move cursor to second line
      lcd.print("Age = " + String(age));
      delay(5000);
      lcd.clear();
    } else {
      // Handle specific HTTP response codes
      switch (httpResponseCode) {
        case 400:  // Bad Request
          lcd.clear();
          lcd.print("Bad Request");
          Serial.println("Error 400: Bad Request - Check input data.");
          break;
        case 404:  // Not Found
          lcd.clear();
          lcd.print("License Not Found");
          Serial.println("Error 404: License not found.");
          break;
        case 500:  // Internal Server Error
          lcd.clear();
          lcd.print("Server Error");
          Serial.println("Error 500: Internal server error.");
          break;
        default:   // Other HTTP errors
          lcd.clear();
          lcd.print("HTTP Error");
          Serial.println("HTTP Error Code: " + String(httpResponseCode));
          break;
      }
    }

    http.end();  // Free resources
  } else {
    Serial.println("WiFi Not Connected");
    lcd.clear();
    lcd.print("WiFi Not Conn");
  }
}

String getCurrentDateTime() {  // Return current date and time as a string
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(worldTimeApiUrl);  // Use the WorldTime API URL

        int httpResponseCode = http.GET();  // Make GET request
        String datetime = "";

        if (httpResponseCode > 0) {
            String response = http.getString();

            // Parse JSON response from WorldTime API
            StaticJsonDocument<200> doc;
            DeserializationError error = deserializeJson(doc, response);

            // Check for errors in parsing
            if (!error) {
                // Extract date and time
                datetime = String(doc["datetime"].as<const char*>());
                Serial.println("Current Date and Time: " + datetime);
            } else {
                Serial.println("Failed to parse WorldTime API JSON: " + String(error.c_str()));
            }
        } else {
            Serial.println("Error in WorldTime API request: " + String(httpResponseCode));
        }

        http.end();  // Free resources
        return datetime;  // Return the current date and time
    } else {
        Serial.println("WiFi Not Connected for WorldTime API");
        return "";  // Return empty string if not connected
    }
}

int calculateAge(int birthYear, int birthMonth, int birthDay, int currentYear, int currentMonth, int currentDay) {
    int age = currentYear - birthYear;  // Initial age calculation

    // Adjust age if the current date is before the birth date
    if (currentMonth < birthMonth || (currentMonth == birthMonth && currentDay < birthDay)) {
        age--;
    }

    return age;  // Return calculated age
}
