# Registration Flow - Visual Architecture

## Component Hierarchy

```
RegisterPage
│
├── Progress Indicator
│   ├── Step 1 (Email)
│   ├── Step 2 (OTP)
│   └── Step 3 (Password)
│
├── Step Content (Conditional Rendering)
│   ├── IF currentStep === "email"
│   │   └── EmailStep
│   │       ├── Email Input
│   │       ├── "Send OTP" Button
│   │       └── Error Message
│   │
│   ├── IF currentStep === "otp"
│   │   └── OTPVerificationStep
│   │       ├── OTPInput
│   │       │   ├── Field 1
│   │       │   ├── Field 2
│   │       │   ├── Field 3
│   │       │   ├── Field 4
│   │       │   ├── Field 5
│   │       │   └── Field 6
│   │       ├── "Verify OTP" Button
│   │       ├── 60s Timer Display
│   │       └── "Resend OTP" Button (conditional)
│   │
│   └── IF currentStep === "password"
│       └── PasswordStep
│           ├── Full Name Input
│           ├── Password Input
│           │   └── Show/Hide Toggle
│           ├── Confirm Password Input
│           │   └── Show/Hide Toggle
│           ├── Error Messages (multiple)
│           └── "Create Account" Button
│
├── Back Button (if not on email step)
│
└── Toast Notification (if toast exists)
    ├── Success Message
    ├── Error Message
    └── Info Message
```

---

## State Management Flow

```
RegisterPage Component State
│
├── Step Tracking
│   └── currentStep: "email" | "otp" | "password"
│
├── Form Data
│   ├── email: ""
│   ├── verifiedEmail: ""
│   ├── name: ""
│   ├── password: ""
│   └── confirmPassword: ""
│
├── Loading States
│   ├── isSendingOTP: false
│   ├── isVerifyingOTP: false
│   ├── isResendingOTP: false
│   └── isRegistering: false
│
├── Error States
│   ├── emailError: ""
│   ├── formErrors: {}
│   └── toast: null
│
└── UI States
    ├── Button disabled states
    ├── Input disabled states
    └── Toast visibility
```

---

## User Flow Diagram

```
                                START
                                  │
                                  ▼
                        ┌──────────────────┐
                        │   Step 1: Email  │
                        │   Entry          │
                        └──────────────────┘
                                  │
                        Enter Email & Click
                        "Send OTP"
                                  │
                                  ▼
                        ┌──────────────────┐
                        │ API: sendOTP()   │
                        └──────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │                           │
              SUCCESS                         ERROR
                    │                           │
                    ▼                           ▼
            ┌──────────────────┐      ┌──────────────────┐
            │ Move to Step 2   │      │ Show Error Toast │
            │ Show Success     │      │ Stay on Step 1   │
            │ Toast           │      │ (Can retry)      │
            └──────────────────┘      └──────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │   Step 2: OTP            │
        │   Verification           │
        │   (60s Timer Active)     │
        └──────────────────────────┘
                    │
        Enter OTP & Click
        "Verify OTP"
                    │
                    ▼
        ┌──────────────────┐
        │API: verifyOTP()  │
        └──────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
    SUCCESS       ERROR      TIMEOUT
        │           │           │
        ▼           ▼           ▼
    Move to   Show Error  Resend OTP
    Step 3    Toast      Available
    Show      Stay on    (Button Enable)
    Success   Step 2
    Toast     (Can retry)
        │
        ▼
┌──────────────────────────┐
│   Step 3: Password       │
│   Setup                  │
└──────────────────────────┘
        │
Enter Name, Password,
Confirm Password &
Click "Create Account"
        │
        ▼
Validation Check
        │
    ┌───┴───┐
    │       │
  VALID   INVALID
    │       │
    │       └→ Show Field Errors
    │         Stay on Step 3
    │
    ▼
┌──────────────────┐
│API: registerUser│
└──────────────────┘
    │
    ├─ SUCCESS ──→ Show Success Toast
    │              Reset Form
    │              Move to Step 1
    │
    └─ ERROR ───→ Show Error Toast
                 Stay on Step 3
                 (Can retry)
```

---

## API Call Sequence Diagram

```
User Browser                    Frontend                    Backend

    │                               │                           │
    │ 1. Enter Email                │                           │
    ├──────────────────────────────→│                           │
    │                               │                           │
    │ 2. Click "Send OTP"           │                           │
    ├──────────────────────────────→│                           │
    │                               │ 3. POST /otp/send         │
    │                               ├──────────────────────────→│
    │                               │                           │
    │                               │ 4. Send OTP to email      │
    │                               │←──────────────────────────┤
    │                               │                           │
    │ 5. Show Success Toast         │                           │
    │←──────────────────────────────┤                           │
    │                               │                           │
    │ 6. Move to Step 2             │                           │
    │←──────────────────────────────┤                           │
    │                               │                           │
    │ 7. User receives OTP email    │                           │
    │   (External email service)    │                           │
    │                               │                           │
    │ 8. Enter OTP digits           │                           │
    ├──────────────────────────────→│                           │
    │                               │                           │
    │ 9. Click "Verify OTP"         │                           │
    ├──────────────────────────────→│                           │
    │                               │ 10. POST /otp/verify      │
    │                               ├──────────────────────────→│
    │                               │                           │
    │                               │ 11. Validate OTP          │
    │                               │←──────────────────────────┤
    │                               │                           │
    │ 12. Show Success Toast        │                           │
    │←──────────────────────────────┤                           │
    │                               │                           │
    │ 13. Move to Step 3            │                           │
    │←──────────────────────────────┤                           │
    │                               │                           │
    │ 14. Enter Name & Password     │                           │
    ├──────────────────────────────→│                           │
    │                               │                           │
    │ 15. Click "Create Account"    │                           │
    ├──────────────────────────────→│                           │
    │                               │ 16. POST /register        │
    │                               ├──────────────────────────→│
    │                               │                           │
    │                               │ 17. Create user account   │
    │                               │←──────────────────────────┤
    │                               │                           │
    │ 18. Show Success Toast        │                           │
    │←──────────────────────────────┤                           │
    │                               │                           │
    │ 19. Reset Form                │                           │
    │←──────────────────────────────┤                           │
    │                               │                           │
    │ ✅ REGISTRATION COMPLETE      │                           │
    │                               │                           │
```

---

## Component Props Flow Diagram

```
RegisterPage
│
├─ EmailStep
│  ├── email (string)
│  ├── onChange (function: setEmail)
│  ├── onSendOTP (function: handleSendOTP)
│  ├── isSending (boolean)
│  └── error (string)
│
├─ OTPVerificationStep
│  ├── email (string)
│  ├── onVerifySuccess (function: handleVerifyOTP)
│  ├── onResend (function: handleResendOTP)
│  ├── isVerifying (boolean)
│  └── isResending (boolean)
│      │
│      └─ OTPInput
│         ├── value (string)
│         ├── onChange (function: setOtp)
│         ├── length (number: 6)
│         └── disabled (boolean)
│
├─ PasswordStep
│  ├── name (string)
│  ├── onNameChange (function: setName)
│  ├── password (string)
│  ├── onPasswordChange (function: setPassword)
│  ├── confirmPassword (string)
│  ├── onConfirmPasswordChange (function: setConfirmPassword)
│  ├── onRegister (function: handleRegister)
│  ├── isRegistering (boolean)
│  └── errors (object)
│
└─ Toast
   ├── message (string)
   ├── type (string: success/error/info)
   ├── onClose (function)
   └── duration (number: 3000)
```

---

## Data Flow Diagram

```
User Input
    │
    ├→ Email Input
    │   │
    │   └→ Validation
    │       ├→ Email Regex Check
    │       └→ Enable/Disable "Send OTP"
    │           │
    │           ├→ Valid: Button Enabled
    │           └→ Invalid: Button Disabled
    │
    ├→ OTP Input
    │   │
    │   ├→ Single Digit Entry
    │   │   ├→ Validate Numeric Only
    │   │   ├→ Auto-focus Next Field
    │   │   └→ Store in State
    │   │
    │   └→ 6-Digit Completion
    │       └→ Enable "Verify OTP" Button
    │
    └→ Password Input
        │
        ├→ Name Validation
        │   └→ Required Check
        │
        ├→ Password Validation
        │   ├→ Required Check
        │   ├→ Min 6 Characters
        │   └→ Display Error if Invalid
        │
        ├→ Confirm Password Validation
        │   ├→ Required Check
        │   ├→ Match with Password
        │   └→ Display Error if Invalid
        │
        └→ Form Validation
            └→ All Valid: Enable "Create Account"
```

---

## State Transition Diagram

```
                    INITIAL STATE
                        │
                   currentStep: "email"
                   All fields empty
                   All errors empty
                   All loading: false
                        │
                        ▼
            ┌──────────────────────┐
            │   EMAIL STEP         │
            └──────────────────────┘
                        │
            User enters valid email
            & clicks "Send OTP"
                        │
                        ▼
            isSendingOTP = true
            (Disable inputs/buttons)
                        │
            API Response received
                        │
            ┌───────────┴───────────┐
            │                       │
         SUCCESS                  ERROR
            │                       │
            ├→ isSendingOTP=false   ├→ isSendingOTP=false
            ├→ currentStep="otp"    ├→ emailError=msg
            ├→ email=value          └→ stay on email step
            └→ showToast(success)
                        │
                        ▼
            ┌──────────────────────┐
            │   OTP STEP           │
            │ (Timer: 60s)         │
            └──────────────────────┘
                        │
            User enters OTP
            & clicks "Verify OTP"
                        │
                        ▼
            isVerifyingOTP = true
            (Disable inputs/buttons)
                        │
            API Response received
                        │
            ┌───────────┴───────────┐
            │                       │
         SUCCESS                  ERROR
            │                       │
            ├→ isVerifyingOTP=false ├→ isVerifyingOTP=false
            ├→ currentStep="pass"   ├→ showToast(error)
            ├→ verifiedEmail=email  └→ stay on otp step
            └→ showToast(success)
                        │
                        ▼
            ┌──────────────────────┐
            │ PASSWORD STEP        │
            └──────────────────────┘
                        │
            User enters data
            & clicks "Create Account"
                        │
                        ▼
            Validation Check
                        │
            ┌───────────┴───────────┐
            │                       │
          VALID                   INVALID
            │                       │
            ├→ isRegistering=true   ├→ Show field errors
            │                       └→ stay on password step
            ├→ API Call
            │
            ┌───────────┴───────────┐
            │                       │
         SUCCESS                  ERROR
            │                       │
            ├→ isRegistering=false  ├→ isRegistering=false
            ├→ currentStep="email"  ├→ showToast(error)
            ├→ RESET ALL STATE      └→ stay on password step
            ├→ showToast(success)
            │
            ▼
    ✅ BACK TO INITIAL STATE
       Ready for new registration
```

---

## Error Handling Flow

```
API Call Made
    │
    ▼
┌─────────────────────┐
│ Try-Catch Block     │
└─────────────────────┘
    │
    ├── SUCCESS Path
    │   ├─ Update UI State
    │   ├─ Show Success Toast
    │   └─ Move to Next Step
    │
    ├── ERROR Path
    │   │
    │   ▼
    │ Extract Error Message
    │   ├─ From API response: error.response?.data?.message
    │   ├─ From Error object: error.message
    │   └─ Default: Generic error message
    │       │
    │       ▼
    │   Show Error Toast
    │   │
    │   └─ Display for 3 seconds then auto-dismiss
    │
    └── FINALLY Block
        │
        ├─ setIsLoading = false
        ├─ Re-enable buttons
        └─ Re-enable inputs
```

---

## Validation Rules Matrix

```
┌──────────────────┬──────────────────┬──────────────────┐
│ Field            │ Rule             │ Status           │
├──────────────────┼──────────────────┼──────────────────┤
│ EMAIL            │ Valid format     │ Required         │
│                  │ (regex)          │ Checked on send  │
├──────────────────┼──────────────────┼──────────────────┤
│ OTP              │ 6 digits         │ Required         │
│                  │ Numeric only     │ Checked on send  │
├──────────────────┼──────────────────┼──────────────────┤
│ FULL NAME        │ Not empty        │ Required         │
│                  │ Not whitespace   │ Checked on send  │
├──────────────────┼──────────────────┼──────────────────┤
│ PASSWORD         │ Required         │ Required         │
│                  │ Min 6 characters │ Checked on send  │
├──────────────────┼──────────────────┼──────────────────┤
│ CONFIRM PASSWORD │ Required         │ Required         │
│                  │ Must match       │ Real-time check  │
│                  │ password         │                  │
└──────────────────┴──────────────────┴──────────────────┘
```

---

## Loading State Impact Matrix

```
┌──────────────────────┬──────────────────────┐
│ Loading State        │ Effect               │
├──────────────────────┼──────────────────────┤
│ isSendingOTP=true    │ - Disable Email input│
│                      │ - Disable Send btn   │
│                      │ - Show "Sending..."  │
├──────────────────────┼──────────────────────┤
│ isVerifyingOTP=true  │ - Disable OTP input  │
│                      │ - Disable Verify btn │
│                      │ - Show "Verifying..."│
├──────────────────────┼──────────────────────┤
│ isResendingOTP=true  │ - Disable Resend btn │
│                      │ - Show "Sending..."  │
├──────────────────────┼──────────────────────┤
│ isRegistering=true   │ - Disable Name input │
│                      │ - Disable Pass input │
│                      │ - Disable Confirm    │
│                      │ - Disable Create btn │
│                      │ - Show "Creating..." │
└──────────────────────┴──────────────────────┘
```

---

## Toast Notification Timeline

```
Toast Triggered
    │
    ├─ Success: ✅ (Green)
    ├─ Error: ❌ (Red)
    └─ Info: ℹ️ (Blue)
        │
        ▼
    Display Toast (appears with fade-in animation)
        │
        ├─ Position: Top-right corner
        ├─ Animation: Fade-in 300ms
        ├─ Duration: 3 seconds
        └─ Auto-dismiss: Yes
            │
            ▼
        After 3 seconds
            │
            ├─ Fade-out animation
            ├─ Remove from DOM
            └─ User can continue
```

---

## Component Lifecycle Diagram

```
RegisterPage Mounts
    │
    ├─ Initialize state
    ├─ Set currentStep = "email"
    └─ All values = "" or false
        │
        ▼
    User Interaction
        │
        ├─ emailStep renders
        │   ├─ User enters email
        │   ├─ onChange updates state
        │   └─ Send OTP on button click
        │       │
        │       ├─ API call
        │       ├─ Update state
        │       └─ Move to OTP step
        │
        ├─ OTPVerificationStep renders
        │   ├─ OTPInput renders
        │   ├─ User enters OTP digits
        │   ├─ onChange updates state
        │   ├─ Auto-focus next field
        │   ├─ Verify OTP on button click
        │   │   │
        │   │   ├─ API call
        │   │   ├─ Update state
        │   │   └─ Move to password step
        │   │
        │   └─ Timer runs (60s)
        │       └─ After 60s, show resend
        │
        └─ PasswordStep renders
            ├─ User enters name
            ├─ User enters password
            ├─ onChange updates state
            ├─ Real-time validation
            ├─ Create account on click
            │   │
            │   ├─ Validation check
            │   ├─ API call
            │   ├─ Reset all state
            │   └─ Back to email step
            │
            └─ Form ready for new registration
```

---

**This visual guide helps understand the architecture, flow, state management, and data flow of the registration system.**
