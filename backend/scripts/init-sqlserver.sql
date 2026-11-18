-- ============================================================
-- SQL SERVER SQLEXPRESS - INITIALIZATION SCRIPT
-- Databases: yabiso_auth, yabiso_audit
-- ============================================================

-- Create databases
CREATE DATABASE yabiso_auth;
GO

CREATE DATABASE yabiso_audit;
GO

-- Switch to yabiso_auth database
USE yabiso_auth;
GO

-- ============================================================
-- AUTHENTIFICATION TABLES
-- ============================================================

CREATE TABLE users_auth (
  user_id VARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
  email NVARCHAR(255) UNIQUE NOT NULL,
  hashed_password NVARCHAR(255) NOT NULL,
  mfa_enabled BIT DEFAULT 0,
  mfa_secret NVARCHAR(255),
  oauth_providers NVARCHAR(MAX),  -- JSON: {"google": "sub", "microsoft": "oid"}
  last_login_at DATETIME2(7),
  last_password_change DATETIME2(7),
  account_locked_until DATETIME2(7) NULL,
  login_attempts INT DEFAULT 0,
  created_at DATETIME2(7) DEFAULT GETUTCDATE(),
  updated_at DATETIME2(7) DEFAULT GETUTCDATE(),
  deleted_at DATETIME2(7) NULL
);

CREATE NONCLUSTERED INDEX idx_users_email ON users_auth(email);
CREATE NONCLUSTERED INDEX idx_users_deleted ON users_auth(deleted_at) WHERE deleted_at IS NOT NULL;

-- ============================================================
-- REFRESH TOKENS
-- ============================================================

CREATE TABLE refresh_tokens (
  token_id VARCHAR(36) PRIMARY KEY DEFAULT NEWID(),
  user_id VARCHAR(36) NOT NULL FOREIGN KEY REFERENCES users_auth(user_id) ON DELETE CASCADE,
  token NVARCHAR(500) NOT NULL UNIQUE,
  expires_at DATETIME2(7) NOT NULL,
  revoked_at DATETIME2(7) NULL,
  ip_address VARCHAR(45),
  user_agent NVARCHAR(500),
  created_at DATETIME2(7) DEFAULT GETUTCDATE()
);

CREATE NONCLUSTERED INDEX idx_refresh_user ON refresh_tokens(user_id, revoked_at);
CREATE NONCLUSTERED INDEX idx_refresh_expires ON refresh_tokens(expires_at);

-- ============================================================
-- AUDIT DATABASE
-- ============================================================

USE yabiso_audit;
GO

CREATE TABLE audit_logs (
  audit_id BIGINT PRIMARY KEY IDENTITY(1,1),
  timestamp DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
  user_id VARCHAR(36),
  action NVARCHAR(20) NOT NULL,  -- CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT
  entity_type NVARCHAR(50) NOT NULL,  -- Product, Payment, User, Order
  entity_id VARCHAR(36),
  old_value NVARCHAR(MAX),
  new_value NVARCHAR(MAX),
  ip_address VARCHAR(45),
  user_agent NVARCHAR(500),
  status NVARCHAR(20) DEFAULT 'SUCCESS',  -- SUCCESS, FAILURE
  error_message NVARCHAR(MAX),
  request_id NVARCHAR(100)  -- Correlation ID
);

-- Create indexes for performance
CREATE NONCLUSTERED INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE NONCLUSTERED INDEX idx_audit_user ON audit_logs(user_id, timestamp DESC);
CREATE NONCLUSTERED INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE NONCLUSTERED INDEX idx_audit_action ON audit_logs(action, timestamp DESC);

-- Set retention policy (audit logs append-only)
ALTER TABLE audit_logs ADD CONSTRAINT ck_audit_immutable CHECK (1=1);

-- ============================================================
-- CREATE DEFAULT USERS (FOR TESTING ONLY - DELETE IN PRODUCTION)
-- ============================================================

USE yabiso_auth;
GO

-- Test Admin User
INSERT INTO users_auth (email, hashed_password, created_at, updated_at)
VALUES ('admin@yabiso.cd', '$2b$12$dummy_hash_admin', GETUTCDATE(), GETUTCDATE());

-- Test Supplier User
INSERT INTO users_auth (email, hashed_password, created_at, updated_at)
VALUES ('supplier@yabiso.cd', '$2b$12$dummy_hash_supplier', GETUTCDATE(), GETUTCDATE());

-- Test Buyer User
INSERT INTO users_auth (email, hashed_password, created_at, updated_at)
VALUES ('buyer@yabiso.cd', '$2b$12$dummy_hash_buyer', GETUTCDATE(), GETUTCDATE());

PRINT 'SQL Server initialization completed successfully!';
