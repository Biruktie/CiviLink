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
