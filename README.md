# MERN Stock Management

A mini stock management system built with the **MERN stack** (MongoDB, Express, React + Vite, Node).  
This project was created as a demo to showcase full-stack fundamentals such as authentication, role-based access, and CRUD operations.

---

## ✨ Features

- **Authentication & Roles**
  - User registration & login (session-based authentication)
  - Role-based access control:
    - **Admin**: Create, Update, Delete, View products
    - **User**: View products only
- **Product Management**
  - Product schema includes:
    - `name` (unique, required)
    - `description` (required)
    - `price` (non-negative number)
    - `quantity` (non-negative number)
    - `minStock` (non-negative number, threshold for low stock)
  - Validation rules:
    - Prevent negative numbers for price, quantity, and minStock
    - All required fields enforced
- **Database**
  - MongoDB Atlas for persistence
- **Frontend**
  - React (Vite) with navigation and pages:
    - Home, Login, Register, Profile
  - Conditional nav links depending on login state

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router  
- **Backend:** Node.js, Express, Mongoose  
- **Database:** MongoDB Atlas  
- **Auth:** Express sessions,bcrypt

---

## 🚀 Getting Started

### Prerequisites
- Node.js and npm installed
- MongoDB Atlas account (or local MongoDB if you prefer)

### Installation

Clone the repository:
```bash
git clone https://github.com/george1518/mern-stock-management.git
cd mern-stock-management

git clone https://github.com/george1518/mern-stock-management.git
cd mern-stock-management
