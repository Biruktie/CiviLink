### **1. Upload User ID (Fayda / Kebele)**  
`POST /api/v1/user/id/upload`  
![POST](https://img.shields.io/badge/POST-4CAF50?style=flat&labelColor=000)

**Auth:** Required  
**Purpose:** Upload ID document for OCR processing.

#### Content Type
`multipart/form-data`

#### Fields
- **type** — `"fayda"` | `"kebele"`  
- **file** — uploaded image

#### Response — 201 Created 
- Triggers **OCR background job**

```
{
  "success": true,
  "data": {
    "message": "ID uploaded successfully and OCR processing finished."
  }
}
```

### **2. Check if Both Fayda and Kebele IDs Are Uploaded**  
`GET /api/v1/user/id/upload`  
![GET](https://img.shields.io/badge/GET-2196F3?style=flat&labelColor=000)

**Purpose:** Verify whether both ID documents (Fayda & Kebele) have been uploaded.

**Auth:** Required

#### Response — 200 OK (If both IDs exist)
```json
{
  "success": true,
  "message": "Both Fayda and Kebele IDs are uploaded."
}
