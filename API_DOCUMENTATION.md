# Amollo Dairy Farm Manager - Backend API Documentation

## Overview
This document describes all the API endpoints that need to be implemented for the Dairy Farm Management System. The frontend is configured to connect to `http://localhost:3000/api` by default.

## Authentication
All endpoints (except login) require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

### POST /auth/login
Login with phone number and password (root user) or phone number only (farmhand)

**Request Body:**
```json
{
  "phone_number": "0724535739",
  "password": "Newpassword1", // Optional for farmhand
  "role": "root" // or "farmhand"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "name": "Rowan Hongo",
    "phone_number": "0724535739",
    "role": "root",
    "can_access_expenses": true,
    "created_at": "2025-01-01T00:00:00Z"
  }
}
```

### POST /auth/logout
Logout current user (optional endpoint)

---

## User Management Endpoints

### GET /users/profile
Get current user's profile

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Rowan Hongo",
  "phone_number": "0724535739",
  "role": "root",
  "can_access_expenses": true,
  "created_at": "2025-01-01T00:00:00Z"
}
```

### PUT /users/profile
Update current user's profile

**Request Body:**
```json
{
  "name": "New Name",
  "phone_number": "0700000000"
}
```

### PUT /users/password
Update password (root users only)

**Request Body:**
```json
{
  "old_password": "current_password",
  "new_password": "new_password"
}
```

### GET /users?farm_id={farm_id}
List all users for a farm (root only)

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "User Name",
    "phone_number": "0700000000",
    "role": "farmhand",
    "can_access_expenses": false,
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### POST /users
Create new user (root only)

**Request Body:**
```json
{
  "name": "New User",
  "phone_number": "0700000000",
  "role": "root", // or "farmhand"
  "password": "password123", // Only for root users
  "farm_id": "farm_uuid"
}
```

### DELETE /users/{user_id}
Delete user (root only)

### PUT /users/{user_id}/access
Update farmhand expense access (root only)

**Request Body:**
```json
{
  "can_access_expenses": true
}
```

---

## Farm Management Endpoints

### GET /farms
List all farms for current user

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Amollo Farm",
    "location": "Nairobi, Kenya",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### GET /farms/{id}
Get specific farm details

### POST /farms
Create new farm (root only)

**Request Body:**
```json
{
  "name": "New Farm",
  "location": "Location"
}
```

### PUT /farms/{id}
Update farm details (root only)

---

## Animal Management Endpoints

### GET /animals?farm_id={farm_id}
List all animals for a farm

**Response (200):**
```json
[
  {
    "id": "uuid",
    "tag_id": "A001",
    "name": "Bessie",
    "sex": "Female",
    "status": "Lactating – Open",
    "breed": "Friesian",
    "date_of_birth": "2020-01-15",
    "sire": "Unknown",
    "dam": "Unknown",
    "acquisition_date": "2020-01-15",
    "acquisition_source": "Born on farm",
    "weight": 450.5,
    "body_condition_score": 3,
    "bcs_recorded_on": "2025-01-01",
    "photo_url": "https://example.com/photo.jpg",
    "farm_id": "farm_uuid",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### GET /animals/{id}
Get specific animal details

### POST /animals
Add new animal (accepts FormData for photo upload)

**FormData Fields:**
- tag_id
- name
- sex
- status
- breed
- date_of_birth
- sire
- dam
- acquisition_date
- acquisition_source
- weight (optional)
- body_condition_score (optional)
- bcs_recorded_on (optional)
- photo (file, optional)
- farm_id

### PUT /animals/{id}
Update animal (accepts FormData)

### DELETE /animals/{id}
Delete animal

---

## Milk Production Endpoints

### GET /milk/records?farm_id={farm_id}&start_date={date}&end_date={date}&animal_id={id}
List milk records with optional filters

**Response (200):**
```json
[
  {
    "id": "uuid",
    "animal_id": "animal_uuid",
    "date": "2025-01-01",
    "morning_yield": 12.5,
    "evening_yield": 10.3,
    "total_yield": 22.8,
    "saleable": 20.8,
    "farm_id": "farm_uuid",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### POST /milk/records
Record milk yield

**Request Body:**
```json
{
  "animal_id": "animal_uuid",
  "date": "2025-01-01",
  "morning_yield": 12.5,
  "evening_yield": 10.3,
  "saleable": 20.8,
  "farm_id": "farm_uuid"
}
```

### POST /milk/calf-allocation
Record calf milk allocation

**Request Body:**
```json
{
  "date": "2025-01-01",
  "allocation_amount": 5.0,
  "farm_id": "farm_uuid"
}
```

### GET /milk/calf-allocation?farm_id={farm_id}
List calf allocations

### GET /milk/daily-stats?farm_id={farm_id}&date={date}
Get daily milk statistics

**Response (200):**
```json
{
  "date": "2025-01-01",
  "total_production": 150.5,
  "total_sold": 140.0,
  "calf_allocation": 10.5
}
```

### GET /milk/dashboard-stats?farm_id={farm_id}
Get dashboard statistics

**Response (200):**
```json
{
  "herd_size": 50,
  "daily_production": 150.5,
  "daily_sold": 140.0,
  "lactating_cows": 35,
  "avg_daily_yield": 4.3,
  "highest_producer": {
    "name": "Bessie",
    "tag_id": "A001",
    "yield": 15.5
  },
  "lowest_producer": {
    "name": "Daisy",
    "tag_id": "A002",
    "yield": 2.1
  },
  "weekly_production": [
    {
      "date": "2025-01-01",
      "production": 150.5,
      "sold": 140.0
    }
  ]
}
```

---

## Health Management Endpoints

### GET /health/disease?farm_id={farm_id}&animal_id={id}&start_date={date}&end_date={date}
List disease treatment records

**Response (200):**
```json
[
  {
    "id": "uuid",
    "animal_id": "animal_uuid",
    "date": "2025-01-01",
    "condition": "Mastitis",
    "symptoms": "Swollen udder, reduced milk",
    "treatment": "Antibiotic injection, 10ml",
    "treated_by": "Veterinarian",
    "veterinarian_name": "Dr. Smith",
    "milk_withdrawal_days": 3,
    "meat_withdrawal_days": 7,
    "remarks": "Follow-up in 3 days",
    "treatment_cost": 2000,
    "cost_description": "Vet visit + medicine",
    "farm_id": "farm_uuid",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### POST /health/disease
Add disease treatment record

### GET /health/preventive?farm_id={farm_id}&animal_id={id}&procedure={type}
List preventive health records

**Response (200):**
```json
[
  {
    "id": "uuid",
    "procedure": "Vaccination",
    "date": "2025-01-01",
    "product_name": "FMD Vaccine",
    "dose": "2ml",
    "administered_by": "Veterinarian",
    "remarks": "Annual vaccination",
    "animal_ids": ["uuid1", "uuid2"],
    "farm_id": "farm_uuid",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### POST /health/preventive
Record preventive procedure

### GET /health/procedures?farm_id={farm_id}
List preventive procedure templates

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Annual FMD Vaccination",
    "interval_days": 365,
    "farm_id": "farm_uuid"
  }
]
```

### POST /health/procedures
Create procedure template

---

## Breeding Management Endpoints

### GET /breeding/records?farm_id={farm_id}&animal_id={id}
List breeding records

**Response (200):**
```json
[
  {
    "id": "uuid",
    "animal_id": "animal_uuid",
    "heat_date": "2025-01-01",
    "heat_signs": "Restless, mounting behavior",
    "service_date": "2025-01-02",
    "service_type": "Artificial Insemination",
    "semen_type": "Sexed",
    "sire": "Bull001",
    "breeding_goal": "Improve milk production",
    "inseminator": "John Doe",
    "remarks": "Good heat signs",
    "result": "Pregnant",
    "expected_delivery_date": "2025-10-02",
    "farm_id": "farm_uuid",
    "created_at": "2025-01-02T00:00:00Z"
  }
]
```

### POST /breeding/records
Add breeding record

### PUT /breeding/records/{id}
Update breeding record

### GET /breeding/sires?farm_id={farm_id}
List sire profiles

**Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "Champion Bull",
    "breed": "Friesian",
    "registration_number": "FR123456",
    "source": "Kenya Stud",
    "farm_id": "farm_uuid",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### POST /breeding/sires
Add sire profile

---

## Expense Management Endpoints

### GET /expenses?farm_id={farm_id}&start_date={date}&end_date={date}&category={type}
List expenses with filters

**Response (200):**
```json
[
  {
    "id": "uuid",
    "category": "Feeds",
    "date": "2025-01-01",
    "amount": 5000,
    "description": "Dairy meal 50kg bags x 10",
    "animal_id": null,
    "employee_id": null,
    "farm_id": "farm_uuid",
    "created_at": "2025-01-01T00:00:00Z"
  }
]
```

### POST /expenses
Log new expense

### PUT /expenses/{id}
Update expense

### DELETE /expenses/{id}
Delete expense

### GET /expenses/total?farm_id={farm_id}&start_date={date}&end_date={date}
Get total expenses

**Response (200):**
```json
{
  "total": 125000
}
```

---

## Response Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

## Error Response Format
```json
{
  "message": "Error description"
}
```

## Notes for Backend Implementation

1. **Default Root User**: Create a seed user:
   - Name: Rowan Hongo
   - Phone: 0724535739
   - Password: Newpassword1
   - Role: root

2. **Authentication**:
   - Root users require phone + password
   - Farmhands require only phone (verified against database)
   - JWT tokens should include user_id and role

3. **Authorization**:
   - Root users can access all endpoints
   - Farmhands cannot access: farm settings, user management, expenses (unless granted access)

4. **File Uploads**:
   - Animal photos should be stored securely
   - Return public URLs in responses

5. **Date Formats**:
   - Use ISO 8601 format (YYYY-MM-DD for dates, full ISO string for timestamps)

6. **Calculations**:
   - `total_yield` = `morning_yield` + `evening_yield`
   - `saleable` = total milk - calf allocation - spillage

7. **WhatsApp Notifications** (Future Feature):
   - Store notification preferences per user
   - Send alerts for upcoming procedures, breeding dates, etc.
