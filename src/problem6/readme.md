# Module Specification: User Score Leaderboard

## 1. Overview

This module manages user scores and leaderboard ranking.

- Users perform actions within the system.
- Each action, when legitimately completed, grants a predefined score.
- Leaderboards display the top 10 users ranked by total score.
- **Redis** is used for efficient ranking, and **WebSocket** is used to update clients in real-time.
- The system employs **anti-spam tokens** and **proof-of-work (PoW)** to ensure security and prevent score abuse.

---

## 2. Malicious User Behaviors

Malicious users are defined as those attempting to illegally gain scores or disrupt the system.  
Examples include:

- Sending API calls directly to increase score without completing actions.
- Replaying previously issued tokens to claim scores multiple times.
- Forging fake proof-of-work submissions.
- Spamming score update requests to overload the system.

---

## 3. Actors

- **User** → Performs actions that affect their score.
- **Application Server (BE)** → Handles validation, scoring, and leaderboard updates.
- **Redis** → Stores real-time scores and leaderboards.
- **Database (DB)** → Stores user profiles, actions, and historical scores.
- **WebSocket Service** → Sends leaderboard updates to connected clients.

---

## 4. Functional Requirements

| ID    | Requirement                                                                 |
|-------|-----------------------------------------------------------------------------|
| FR-1  | The system must allow a user to initiate an action that can increase their score. |
| FR-2  | Upon initiating an action, the backend must return an **anti-spam token** to the frontend. |
| FR-3  | The frontend must collect a **proof-of-work (PoW)** from the user (e.g., quiz result, completed task evidence). |
| FR-4  | The frontend must call the backend API to finalize the action with both the **anti-spam token** and **PoW**. |
| FR-5  | The backend must validate the **token** and **PoW** before updating the user’s score. |
| FR-6  | After the score is updated, the leaderboard in **Redis** must be updated atomically. |
| FR-7  | The backend must notify all subscribed clients via **WebSocket** whenever the **top 10 leaderboard** changes. |
| FR-8  | Users can query the leaderboard at any time to fetch the **top 10 scores**. |

---

## 5. Non-Functional Requirements

| ID      | Requirement                                                                |
|---------|---------------------------------------------------------------------------|
| NFR-1   | Leaderboard queries must respond within **< 100ms** under normal load.     |
| NFR-2   | The system must support **100K+ concurrent users** without degradation.    |
| NFR-3   | The scoring and leaderboard system must be **eventually consistent** with the DB. |
| NFR-4   | **WebSocket** notifications must propagate leaderboard updates within **< 1s**. |
| NFR-5   | **Anti-spam tokens** must expire after a short period (**e.g., 30 seconds**). |

---

## 6. Data Model
### Database Schema


### **6.1. `user` Table**
Stores basic user information.

| Column       | Type          | Constraints               | Description                                |
|-------------|--------------|---------------------------|--------------------------------------------|
| `id`        | UUID       | PK        | Unique identifier for each user           |
| `username`  | VARCHAR(255) | UNIQUE, NOT NULL          | User's display name                       |
| `email`     | VARCHAR(255) | UNIQUE, NOT NULL          | Email address                             |
| `password`  | VARCHAR(255) | NOT NULL                  | Hashed password                           |
| `created_at`| TIMESTAMP    | DEFAULT NOW()             | Account creation timestamp               |
| `updated_at`| TIMESTAMP    | DEFAULT NOW() ON UPDATE NOW() | Last update timestamp              |

---

### **6.2. `user_action` Table**
Tracks **which actions** were performed by a **specific user** and prevents score duplication.

| Column          | Type          | Constraints         | Description                                 |
|-----------------|--------------|---------------------|---------------------------------------------|
| `id`           | UUID       | PK  | Unique identifier                           |
| `user_id`      | UUID       | FK → `user.id`      | The user performing the action             |
| `action_type`    | ENUM       | NOT NULL | Type of action                            |
| `score_value` | INT          | NOT NULL        | Score at created_at time |
| `proof_of_work`| JSONB        | NULLABLE            | The submitted PoW data (e.g., quiz answers) |
| `created_at`   | TIMESTAMP    | DEFAULT NOW()       | When the action was initiated              |
| `completed_at` | TIMESTAMP    | NULLABLE            | When the action was successfully completed |

---


## 7. Redis Key Schema

| Key                          | Type   | Description                                           | TTL   |
|-----------------------------|--------|-------------------------------------------------------|-------|
| `leaderboard:global`        | ZSET   | Stores user IDs as members and total scores as scores | None  |
| `user:score:<userId>`       | STRING | Cached score for a single user                        | None  |
| `token:<tokenId>`     | STRING | Anti-spam token marker for validation + replay protection     | 30s   |


## 8. Security Measures

### **Anti-Spam Tokens**
- Issued when an action starts.
- Single-use: deleted after successful finalization
- Token encodes userId, actionId, and exp (expiry).
- Stored in Redis for TTL and replay protection.

### **Proof-of-Work (PoW)**
- Represents verifiable evidence of action completion.
- Backend verifies PoW before updating scores.

### **Rate Limiting**
- Enforce per-user and per-IP thresholds.

### **Replay Protection**
- Used tokens cannot be reused.

### **Atomic Updates**
- **Redis ZSET** operations and DB writes happen in a transactional context.


## 9. API Specifications

### **Authentication**
- APIs that require authentication using **JWT** via the `Authorization: Bearer <token>` header.

---

### **9.1. Initiate Action**

**Endpoint:**  
`POST /api/v1/actions/init`

**Description:**  
Initiates an action that can increase a user’s score and returns an anti-spam token.

**Headers:**
- `Authorization: Bearer <token>`

**Request:**
```json
{
     "actionType": "action-type"
}
```

**Response:**
```json
{
    "antiSpamToken": "jwt-signed-token",
    "expiresIn": 30
}
```

### **9.2. Finalize Action**
**Endpoint:**  
`POST /api/v1/actions/finalize`

**Description:**  
Finalizes the action by providing PoW and the issued anti-spam token.

**Headers:**
- `Authorization: Bearer <token>`

**Request:**

```json
{
  "proof": { "quizResult": "encoded-proof" },
  "antiSpamToken": "jwt-signed-token"
}
```

**Response:**
```json
{
  "success": true,
  "newScore": 1500,
  "leaderboard": [
    { "userId": "u1", "score": 2000 },
    { "userId": "u2", "score": 1800 }
  ]
}
```
### **9.3. Get Leaderboard**
**Endpoint:**
`GET /api/v1/scores/leaderboard`

Description:
Fetches the top 10 users ranked by score.

Response:

```json
{
  "leaderboard": [
    { "userId": "u1", "username": "Alice", "score": 2150 },
    { "userId": "u2", "username": "Bob", "score": 2030 },
    ...
  ]
}
```

## **10. WebSocket Events**
- `leaderboard_update`: Broadcasts the latest leaderboard to all connected clients.
```json
{
    "event": "leaderboard_updated",
    "data": [
        { "userId": "u1", "score": 500, "rank": 1 },
        { "userId": "u2", "score": 480, "rank": 2 }
    ]
}
```

## **10. Sequence Diagram**
mermaid
```
    sequenceDiagram
    participant FE as Frontend
    participant BE as Backend
    participant Redis
    participant DB
    participant WS as WebSocket

    FE->>BE: POST /api/v1/actions/init (actionType)
    BE->>BE: Generate anti-spam token (JWT)
    BE->>Redis: Store token:<tokenId>
    BE-->>FE: Return anti-spam token

    FE->>BE: POST /api/v1/actions/finalize (proof, token)
    BE->>BE: Validate token signature + expiry
    BE->>Redis: Check token exists
    BE->>BE: Validate proof-of-work
    BE->>DB: Update user score transactionally
    BE->>Redis: Update leaderboard (ZADD leaderboard:global)
    Redis-->>BE: Success
    BE->>WS: Broadcast leaderboard update
    BE-->>FE: Return success + new leaderboard
```


## **10. Data Flow**
User starts an action → Backend returns an anti-spam token.

User completes the action → Frontend collects proof-of-work (PoW).

Frontend finalizes the action → Sends token + PoW to backend.

Backend validates → Updates score in Redis.

Leaderboard recalculated automatically via Redis ZSET.

WebSocket service pushes real-time updates if the top 10 leaderboard changes.