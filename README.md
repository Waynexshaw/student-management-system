# Student Management System

A full-stack CRUD application foundation for managing student records.

## Purpose

This project will eventually support viewing, creating, editing, and deleting students. Phase 1 establishes the React/Vite frontend, Express backend, PostgreSQL schema, and routing foundation.

## Selected technologies

- React and Vite
- React Router
- Node.js and Express.js
- PostgreSQL via `pg`
- Supabase-hosted PostgreSQL
- Plain CSS

## High-level architecture

The React frontend communicates with the Express HTTP API using JSON and the Fetch API. The Express backend will perform PostgreSQL queries through `pg`; the frontend never connects directly to PostgreSQL or Supabase.

## Project structure

- `frontend/` — React/Vite client and route foundation
- `backend/` — Express server and PostgreSQL connection foundation
- `database/schema.sql` — students table definition
