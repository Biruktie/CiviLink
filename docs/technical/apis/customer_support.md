### **1. Create a New Conversation (Citizen)**  
`POST /api/v1/chats`  
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat&labelColor=000)

**Auth:** citizen  
**Purpose:** Create a new conversation.

#### Request Body
```json
{
  "subject": "Billing issue",
  "message": "I can't submit"
}
````

#### Response — 201 Created

```json
{
  "conversationId": "...",
  "messageId": "..."
}
```

**Notes:**

* System auto-assigns an officer in the same sub-city with the lowest workload (if configured).
* Notification is triggered.

---

### **2. List Conversations (Officer)**

`GET /api/v1/chats`
![GET](https://img.shields.io/badge/GET-2196F3?style=flat\&labelColor=000)

**Auth:** officer
**Purpose:** List conversations for the current user.

#### Query Parameters

`?page=&limit=`

#### Response

* List of conversations
* Includes `unreadCount`

---

### **3. Send Message in Conversation**

`POST /api/v1/chats/:conversationId/messages`
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat\&labelColor=000)

**Auth:** participant (officer)
**Purpose:** Send a message within a conversation.

#### Request Body

```json
{
  "messageContent": "text"
}
```

#### Response

* Message created
* Unread counters updated
* Notification triggered

---

### **4. Mark Conversation as Read**

`PUT /api/v1/chats/:conversationId/read`
![PUT](https://img.shields.io/badge/PUT-FFC107?style=flat\&labelColor=000)

**Auth:** participant
**Purpose:** Mark all messages in the conversation as read for the current user.

---
