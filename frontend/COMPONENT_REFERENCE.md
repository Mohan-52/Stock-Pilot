# Registration Flow - Component Reference Guide

## Overview

This guide provides quick reference for all new components and their usage.

---

## 1. Toast Component

**Location**: `src/features/auth/components/Toast.jsx`

### Purpose

Display auto-dismissing notifications for success/error/info messages.

### Example Usage

```jsx
import Toast from "../components/Toast";

// In your component
const [toast, setToast] = useState(null);

const showToast = (message, type = "success") => {
  setToast({ message, type });
};

// Render
{
  toast && (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
      duration={3000}
    />
  );
}
```

### Props

| Prop       | Type                           | Default   | Description                |
| ---------- | ------------------------------ | --------- | -------------------------- |
| `message`  | string                         | required  | Toast message text         |
| `type`     | 'success' \| 'error' \| 'info' | 'success' | Message type/color         |
| `duration` | number                         | 3000      | Auto-dismiss time in ms    |
| `onClose`  | function                       | undefined | Callback when toast closes |

### Types & Colors

- `success` → Green background
- `error` → Red background
- `info` → Blue background

---

## 2. OTPInput Component

**Location**: `src/features/auth/components/OTPInput.jsx`

### Purpose

Smart 6-digit OTP input with auto-focus, paste support, and keyboard navigation.

### Example Usage

```jsx
import OTPInput from "../components/OTPInput";

const [otp, setOtp] = useState("");

<OTPInput value={otp} onChange={setOtp} length={6} disabled={isLoading} />;
```

### Props

| Prop       | Type     | Default  | Description             |
| ---------- | -------- | -------- | ----------------------- |
| `value`    | string   | required | Current OTP value       |
| `onChange` | function | required | Called when OTP changes |
| `length`   | number   | 6        | Number of OTP digits    |
| `disabled` | boolean  | false    | Disable all inputs      |

### Features

- ✅ Numeric input only (0-9)
- ✅ Auto-focus to next field on digit entry
- ✅ Backspace navigates to previous field
- ✅ Arrow keys for navigation
- ✅ Paste full OTP from clipboard
- ✅ Validates pasted data (must be numeric)

### Behavior

```javascript
// Auto-focus example
User enters '1' in field 0 → Focus moves to field 1
User enters '2' in field 1 → Focus moves to field 2
// ... and so on

// Paste example
User pastes '123456' in field 0 → All fields filled
Focus moves to field 6 (end)
```

---

## 3. EmailStep Component

**Location**: `src/features/auth/components/EmailStep.jsx`

### Purpose

First step of registration: Email entry and OTP send.

### Example Usage

```jsx
import EmailStep from "../components/EmailStep";

<EmailStep
  email={email}
  onChange={setEmail}
  onSendOTP={handleSendOTP}
  isSending={isSendingOTP}
  error={emailError}
/>;
```

### Props

| Prop        | Type     | Default  | Description              |
| ----------- | -------- | -------- | ------------------------ |
| `email`     | string   | required | Current email value      |
| `onChange`  | function | required | Email change handler     |
| `onSendOTP` | function | required | Send OTP handler         |
| `isSending` | boolean  | false    | Loading state            |
| `error`     | string   | ''       | Error message to display |

### Validation

```javascript
// Email regex pattern
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valid examples: user@example.com, john.doe@company.co.uk
// Invalid: user@, @example.com, user example@com
```

### Handler Signature

```jsx
const handleSendOTP = async (email) => {
  // email: string (user@example.com)
  // Called when "Send OTP" button clicked
  // Email validation done in component
  try {
    await sendOTP(email);
    // Move to next step
  } catch (error) {
    // Show error
  }
};
```

---

## 4. OTPVerificationStep Component

**Location**: `src/features/auth/components/OTPVerificationStep.jsx`

### Purpose

Second step of registration: OTP verification with timer and resend.

### Example Usage

```jsx
import OTPVerificationStep from "../components/OTPVerificationStep";

<OTPVerificationStep
  email={email}
  onVerifySuccess={handleVerifyOTP}
  onResend={handleResendOTP}
  isVerifying={isVerifyingOTP}
  isResending={isResendingOTP}
/>;
```

### Props

| Prop              | Type     | Default  | Description                |
| ----------------- | -------- | -------- | -------------------------- |
| `email`           | string   | required | User's email (for display) |
| `onVerifySuccess` | function | required | Called with OTP on verify  |
| `onResend`        | function | required | Called when resend clicked |
| `isVerifying`     | boolean  | false    | Verification loading state |
| `isResending`     | boolean  | false    | Resend loading state       |

### Features

- ✅ 6-digit OTP input integration
- ✅ 60-second countdown timer
- ✅ "Resend OTP" button appears after timer
- ✅ Resend clears OTP and restarts timer
- ✅ Shows user's email for confirmation

### Handler Signatures

```jsx
const handleVerifyOTP = (otp) => {
  // otp: string (6 digits, e.g., "123456")
  // Called when user clicks "Verify OTP"
  // OTP length validation done in component
};

const handleResendOTP = async () => {
  // Called when "Resend OTP" button clicked
  // Should trigger sendOTP again
};
```

### Timer Logic

```javascript
// Timer countdown (in seconds)
Initial: 60
After 1 sec: 59
After 2 sec: 58
...
At 0: Resend button becomes available

// Resend button state
canResend = timeLeft <= 0
```

---

## 5. PasswordStep Component

**Location**: `src/features/auth/components/PasswordStep.jsx`

### Purpose

Third step of registration: Name and password setup with validation.

### Example Usage

```jsx
import PasswordStep from "../components/PasswordStep";

<PasswordStep
  name={name}
  onNameChange={setName}
  password={password}
  onPasswordChange={setPassword}
  confirmPassword={confirmPassword}
  onConfirmPasswordChange={setConfirmPassword}
  onRegister={handleRegister}
  isRegistering={isRegistering}
  errors={formErrors}
/>;
```

### Props

| Prop                      | Type     | Default  | Description                |
| ------------------------- | -------- | -------- | -------------------------- |
| `name`                    | string   | required | User's full name           |
| `onNameChange`            | function | required | Name change handler        |
| `password`                | string   | required | Password value             |
| `onPasswordChange`        | function | required | Password change handler    |
| `confirmPassword`         | string   | required | Confirm password value     |
| `onConfirmPasswordChange` | function | required | Confirm change handler     |
| `onRegister`              | function | required | Register handler           |
| `isRegistering`           | boolean  | false    | Registration loading state |
| `errors`                  | object   | {}       | Form validation errors     |

### Validation Rules

```javascript
// Name validation
- Required (not empty/whitespace)

// Password validation
- Required
- Minimum 6 characters
- Must match confirmPassword

// Confirm Password validation
- Required
- Must match password exactly
```

### Error Object Structure

```javascript
errors = {
  name: "Full name is required",
  password: "Password must be at least 6 characters",
  confirmPassword: "Passwords do not match",
};

// All fields optional (only include if error exists)
```

### Features

- ✅ Full name input
- ✅ Password field with Show/Hide toggle
- ✅ Confirm password field with Show/Hide toggle
- ✅ Real-time password match validation
- ✅ Form validation before submission
- ✅ Clear error messages

### Handler Signature

```jsx
const handleRegister = async () => {
  // Called when "Create Account" button clicked
  // All validation done in component
  // Button disabled until form is valid
};
```

---

## 6. Updated AuthAPI

**Location**: `src/features/auth/authAPI.js`

### New Functions

#### sendOTP(email)

```javascript
import { sendOTP } from "../authAPI";

try {
  const response = await sendOTP("user@example.com");
  console.log(response); // { message: "OTP Successfully Sent" }
} catch (error) {
  console.error(error.response?.data?.message);
}
```

#### verifyOTP(email, otp)

```javascript
import { verifyOTP } from "../authAPI";

try {
  const response = await verifyOTP("user@example.com", "123456");
  console.log(response); // { message: "Email Successfully Verified" }
} catch (error) {
  console.error(error.response?.data?.message);
}
```

### API Endpoints

```javascript
// Send OTP
POST /api/auth/registration/otp/send?email=user@example.com
Response: { message: "OTP Successfully Sent" }

// Verify OTP
POST /api/auth/registration/otp/verify
Body: { email: "user@example.com", otp: "123456" }
Response: { message: "Email Successfully Verified" }

// Register (existing)
POST /api/auth/register
Body: { email: "user@example.com", name: "John", password: "pass123" }
```

---

## RegisterPage State Management

### State Variables

```javascript
// Step tracking
const [currentStep, setCurrentStep] = useState("email");

// Form fields
const [email, setEmail] = useState("");
const [verifiedEmail, setVerifiedEmail] = useState("");
const [name, setName] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

// Loading states
const [isSendingOTP, setIsSendingOTP] = useState(false);
const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
const [isResendingOTP, setIsResendingOTP] = useState(false);
const [isRegistering, setIsRegistering] = useState(false);

// Error/UI states
const [toast, setToast] = useState(null);
const [emailError, setEmailError] = useState("");
const [formErrors, setFormErrors] = useState({});
```

### Step Flow

```
'email' ──[OTP sent]──> 'otp' ──[OTP verified]──> 'password' ──[Account created]──> 'email' (reset)
   ↑                       ↑                           ↑
   └───────[Back click]────┴────[Back click]──────────┘
```

### Key State Transitions

```javascript
// Email → OTP
setCurrentStep("otp");

// OTP → Password
setCurrentStep("password");
setVerifiedEmail(email); // Lock email

// Password → Email (reset)
setCurrentStep("email");
setEmail("");
setVerifiedEmail("");
setName("");
setPassword("");
setConfirmPassword("");
setFormErrors({});
```

---

## Common Patterns

### Loading State Management

```javascript
// Pattern 1: Prevent submission during loading
const handleSubmit = async () => {
  setIsLoading(true);
  try {
    await apiCall();
  } finally {
    setIsLoading(false);
  }
};

// Use: disabled={isLoading}
```

### Error Handling

```javascript
// Pattern 2: User-friendly error messages
try {
  await apiCall();
} catch (error) {
  const message =
    error.response?.data?.message || error.message || "Something went wrong";
  showToast(message, "error");
}
```

### Form Validation

```javascript
// Pattern 3: Validation before submission
const validate = () => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email required";
  }

  if (password.length < 6) {
    errors.password = "Min 6 characters";
  }

  setErrors(errors);
  return Object.keys(errors).length === 0;
};

if (!validate()) return;
// Submit form
```

---

## Styling Reference

### Tailwind Classes Used

```javascript
// Containers
"flex items-center justify-center min-h-screen bg-gray-100";
"bg-white p-8 rounded-2xl shadow-md w-full max-w-md";

// Buttons
"w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800";
"disabled:bg-gray-400 disabled:cursor-not-allowed";

// Inputs
"w-full mb-4 p-3 border rounded-lg";
"focus:outline-none focus:ring-2 focus:ring-black";
"border-red-500 focus:ring-red-500"; // error state

// Text
"text-2xl font-bold mb-6 text-center";
"text-sm text-gray-600";

// Responsive
"px-4"; // padding for mobile
```

### Custom Animations

```css
/* In App.css */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}
```

---

## Testing Examples

### Test Email Step

```javascript
// Valid email
expect(component.getByText("Send OTP")).not.toBeDisabled();

// Invalid email
expect(component.getByText("Send OTP")).toBeDisabled();

// Error message
expect(component.getByText("Invalid email")).toBeInTheDocument();
```

### Test OTP Step

```javascript
// OTP input
const input = component.getByDisplayValue("");
fireEvent.change(input, { target: { value: "123456" } });

// Verify button disabled until 6 digits
expect(component.getByText("Verify OTP")).toBeDisabled();

// Timer countdown
expect(component.getByText(/Resend OTP in 60s/)).toBeInTheDocument();
```

### Test Password Step

```javascript
// Button disabled until form valid
expect(component.getByText("Create Account")).toBeDisabled();

// Passwords must match
fireEvent.change(passwordInput, { target: { value: "pass123" } });
fireEvent.change(confirmInput, { target: { value: "pass456" } });
expect(component.getByText("Passwords do not match")).toBeInTheDocument();
```

---

## Integration Checklist

- [ ] All 5 new components created in `components/`
- [ ] `RegisterPage.jsx` updated with multi-step logic
- [ ] `authAPI.js` has `sendOTP()` and `verifyOTP()` functions
- [ ] `App.css` has `animate-fade-in` animation
- [ ] Routes configured for `/signup` path
- [ ] Backend OTP endpoints are running
- [ ] Toast notifications display correctly
- [ ] Back buttons work as expected
- [ ] Loading states prevent duplicate submissions
- [ ] All error messages display to user
- [ ] Form resets after successful registration
- [ ] Responsive design works on mobile

---

**That's it! You now have a complete, production-ready OTP verification registration flow.**
