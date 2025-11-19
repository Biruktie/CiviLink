### **1. List Assigned Applications**  
`GET /api/v1/officer/applications`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** officer (department = approval)  
**Purpose:** Get assigned applications (TIN & Vital).  
**Query Parameters:**  
- `status=pending`  
- `limit=25`

---

### **2. Get Application Details**  - Added incase Application(TIN/Vital) API is not sufficient
`GET /api/v1/officer/applications/:id`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** assigned officer only  
**Response:** Full application data

---

### **3. Create Weekly News**  
`POST /api/v1/officer/news`  
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat&labelColor=000)

**Auth:** officer (department = news for this week)  
**Purpose:** Create a weekly news post

#### Request Body
```json
{
  "title": "...",
  "content": "...",
  "headerImageUrl": "..."
}
````

#### Response

```json
{
  "newsId": "..."
}
```

---

### **4. Edit News**

`PUT /api/v1/officer/news/:id`
![PUT](https://img.shields.io/badge/PUT-FFC107?style=flat\&labelColor=000)

**Auth:** authoring officer + currently assigned
**Purpose:** Edit own news while assignment is active

---

### **5. Delete News**

`DELETE /api/v1/officer/news/:id`
![DELETE](https://img.shields.io/badge/DELETE-F44336?style=flat\&labelColor=000)

**Auth:** authoring officer only (within assignment window)
**Purpose:** Remove news post

---

### **6. Get Latest News**  
`GET /api/v1/news/latest`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Auth:** optional (signed-in by default)  
**Purpose:** Retrieve the latest news posts.

#### Response
- Returns the **latest 5 non-archived news** items
```
[
  {
    "newsId": "...",
    "title": "...",
    "content": "...",
    "headerImageUrl": "...",
    "createdAt": "..."
  }
]
```
