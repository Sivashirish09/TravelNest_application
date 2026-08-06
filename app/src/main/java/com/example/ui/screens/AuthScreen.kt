package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.MainViewModel
import kotlinx.coroutines.delay

enum class AuthMode {
    LOGIN, REGISTER
}

enum class PasswordStrength(val label: String, val color: Color, val fraction: Float) {
    EMPTY("", Color.Transparent, 0f),
    WEAK("Weak Password", Color(0xFFFF5252), 0.33f),
    MEDIUM("Medium Strength", Color(0xFFFFB74D), 0.66f),
    STRONG("Strong Password", Color(0xFF4CAF50), 1.0f)
}

@Composable
fun AuthScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val isAuthLoading by viewModel.isAuthLoading.collectAsState()
    val authSuccessMessage by viewModel.authSuccessMessage.collectAsState()
    val authErrorMessage by viewModel.authErrorMessage.collectAsState()
    val isEmailSentVerification by viewModel.isEmailSentVerification.collectAsState()

    var authMode by remember { mutableStateOf(AuthMode.LOGIN) }

    // Input States
    var nameInput by remember { mutableStateOf("") }
    var emailInput by remember { mutableStateOf("sivashirish09@gmail.com") }
    var phoneInput by remember { mutableStateOf("+1 555-0192") }
    var passwordInput by remember { mutableStateOf("Travel#2026") }
    var confirmPasswordInput by remember { mutableStateOf("Travel#2026") }

    var passwordVisible by remember { mutableStateOf(false) }
    var rememberMe by remember { mutableStateOf(true) }
    var acceptedTerms by remember { mutableStateOf(true) }

    // Dialog & Feedback states
    var showForgotPasswordDialog by remember { mutableStateOf(false) }
    var showTermsDialog by remember { mutableStateOf(false) }
    var resetEmailInput by remember { mutableStateOf("") }

    // Local Validation Error messages
    var emailError by remember { mutableStateOf<String?>(null) }
    var passwordError by remember { mutableStateOf<String?>(null) }
    var confirmPasswordError by remember { mutableStateOf<String?>(null) }
    var nameError by remember { mutableStateOf<String?>(null) }

    val scrollState = rememberScrollState()

    // Calculate Password Strength
    val passwordStrength = remember(passwordInput) {
        when {
            passwordInput.isEmpty() -> PasswordStrength.EMPTY
            passwordInput.length < 6 -> PasswordStrength.WEAK
            passwordInput.length >= 8 && passwordInput.any { it.isDigit() } && passwordInput.any { !it.isLetterOrDigit() } -> PasswordStrength.STRONG
            else -> PasswordStrength.MEDIUM
        }
    }

    // Full screen canvas background with floating glow gradients
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF0F2027),
                        Color(0xFF203A43),
                        Color(0xFF2C5364)
                    )
                )
            )
    ) {
        // Decorative glowing particles on background
        Canvas(modifier = Modifier.fillMaxSize()) {
            val canvasWidth = size.width
            val canvasHeight = size.height

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0xFF009688).copy(alpha = 0.35f), Color.Transparent),
                    center = Offset(canvasWidth * 0.2f, canvasHeight * 0.25f),
                    radius = canvasWidth * 0.6f
                ),
                radius = canvasWidth * 0.6f,
                center = Offset(canvasWidth * 0.2f, canvasHeight * 0.25f)
            )

            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(Color(0xFF7E57C2).copy(alpha = 0.3f), Color.Transparent),
                    center = Offset(canvasWidth * 0.8f, canvasHeight * 0.75f),
                    radius = canvasWidth * 0.65f
                ),
                radius = canvasWidth * 0.65f,
                center = Offset(canvasWidth * 0.8f, canvasHeight * 0.75f)
            )
        }

        // Main Scrollable Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // Branding Header / Logo
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Surface(
                    shape = CircleShape,
                    color = Color(0xFF009688),
                    shadowElevation = 10.dp,
                    modifier = Modifier.size(52.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Filled.FlightTakeoff,
                            contentDescription = "TravelNest Logo",
                            tint = Color.White,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column {
                    Text(
                        text = "TravelNest",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        letterSpacing = 1.sp
                    )
                    Text(
                        text = "AI Smart Trip Concierge",
                        fontSize = 12.sp,
                        color = Color.White.copy(alpha = 0.8f),
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Glassmorphism Main Authentication Card
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .shadow(
                        elevation = 20.dp,
                        shape = RoundedCornerShape(28.dp),
                        ambientColor = Color.Black.copy(alpha = 0.5f),
                        spotColor = Color(0xFF009688)
                    )
                    .border(
                        width = 1.5.dp,
                        brush = Brush.linearGradient(
                            listOf(
                                Color.White.copy(alpha = 0.4f),
                                Color.White.copy(alpha = 0.1f)
                            )
                        ),
                        shape = RoundedCornerShape(28.dp)
                    ),
                shape = RoundedCornerShape(28.dp),
                color = Color(0xFF1E293B).copy(alpha = 0.88f)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Title Welcome Text
                    Text(
                        text = if (authMode == AuthMode.LOGIN) "Welcome Back" else "Create Account",
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = if (authMode == AuthMode.LOGIN)
                            "Sign in to access your AI itineraries & saved vault"
                        else
                            "Join thousands of smart global travelers today",
                        fontSize = 13.sp,
                        color = Color.White.copy(alpha = 0.7f),
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    // Email Verification Banner if requested
                    if (isEmailSentVerification) {
                        Surface(
                            color = Color(0xFF0284C7).copy(alpha = 0.25f),
                            shape = RoundedCornerShape(14.dp),
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF38BDF8)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 16.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.MarkEmailRead,
                                    contentDescription = null,
                                    tint = Color(0xFF38BDF8),
                                    modifier = Modifier.size(22.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = "Verification Sent!",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.sp,
                                        color = Color.White
                                    )
                                    Text(
                                        text = "Check inbox to complete registration.",
                                        fontSize = 11.sp,
                                        color = Color.White.copy(alpha = 0.8f)
                                    )
                                }
                                TextButton(onClick = { viewModel.verifyEmailSimulated() }) {
                                    Text("Verify Now", fontSize = 11.sp, color = Color(0xFF38BDF8), fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }

                    // Global Auth Error / Success Messages
                    if (authErrorMessage != null) {
                        Surface(
                            color = Color(0xFFEF4444).copy(alpha = 0.2f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 16.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Filled.ErrorOutline, contentDescription = null, tint = Color(0xFFF87171))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = authErrorMessage!!,
                                    color = Color(0xFFF87171),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }

                    if (authSuccessMessage != null) {
                        Surface(
                            color = Color(0xFF10B981).copy(alpha = 0.2f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 16.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(Icons.Filled.CheckCircle, contentDescription = null, tint = Color(0xFF34D399))
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = authSuccessMessage!!,
                                    color = Color(0xFF34D399),
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }

                    // Name Field (Register Mode Only)
                    AnimatedVisibility(visible = authMode == AuthMode.REGISTER) {
                        Column(modifier = Modifier.padding(bottom = 14.dp)) {
                            OutlinedTextField(
                                value = nameInput,
                                onValueChange = {
                                    nameInput = it
                                    nameError = if (it.isBlank()) "Full name is required" else null
                                },
                                label = { Text("Full Name", color = Color.White.copy(alpha = 0.8f)) },
                                leadingIcon = { Icon(Icons.Filled.Person, contentDescription = null, tint = Color(0xFF009688)) },
                                singleLine = true,
                                isError = nameError != null,
                                shape = RoundedCornerShape(16.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF009688),
                                    unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("auth_name_input")
                            )
                            if (nameError != null) {
                                Text(text = nameError!!, color = Color(0xFFFF5252), fontSize = 11.sp, modifier = Modifier.padding(start = 8.dp, top = 2.dp))
                            }
                        }
                    }

                    // Phone Field (Register Mode Only)
                    AnimatedVisibility(visible = authMode == AuthMode.REGISTER) {
                        Column(modifier = Modifier.padding(bottom = 14.dp)) {
                            OutlinedTextField(
                                value = phoneInput,
                                onValueChange = { phoneInput = it },
                                label = { Text("Phone Number", color = Color.White.copy(alpha = 0.8f)) },
                                leadingIcon = { Icon(Icons.Filled.Phone, contentDescription = null, tint = Color(0xFF009688)) },
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                                shape = RoundedCornerShape(16.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF009688),
                                    unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("auth_phone_input")
                            )
                        }
                    }

                    // Email Field
                    OutlinedTextField(
                        value = emailInput,
                        onValueChange = {
                            emailInput = it
                            emailError = when {
                                it.isBlank() -> "Email address required"
                                !android.util.Patterns.EMAIL_ADDRESS.matcher(it).matches() -> "Invalid email format"
                                else -> null
                            }
                        },
                        label = { Text("Email Address", color = Color.White.copy(alpha = 0.8f)) },
                        leadingIcon = { Icon(Icons.Filled.Email, contentDescription = null, tint = Color(0xFF009688)) },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                        isError = emailError != null,
                        shape = RoundedCornerShape(16.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF009688),
                            unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("auth_email_input")
                    )
                    if (emailError != null) {
                        Text(text = emailError!!, color = Color(0xFFFF5252), fontSize = 11.sp, modifier = Modifier.padding(start = 8.dp, top = 2.dp))
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Password Field
                    OutlinedTextField(
                        value = passwordInput,
                        onValueChange = {
                            passwordInput = it
                            passwordError = if (it.length < 6) "Password must be at least 6 characters" else null
                            if (authMode == AuthMode.REGISTER && confirmPasswordInput.isNotEmpty()) {
                                confirmPasswordError = if (it != confirmPasswordInput) "Passwords do not match" else null
                            }
                        },
                        label = { Text("Password", color = Color.White.copy(alpha = 0.8f)) },
                        leadingIcon = { Icon(Icons.Filled.Lock, contentDescription = null, tint = Color(0xFF009688)) },
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(
                                    imageVector = if (passwordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff,
                                    contentDescription = "Toggle Password Visibility",
                                    tint = Color.White.copy(alpha = 0.7f)
                                )
                            }
                        },
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                        isError = passwordError != null,
                        shape = RoundedCornerShape(16.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF009688),
                            unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("auth_password_input")
                    )
                    if (passwordError != null) {
                        Text(text = passwordError!!, color = Color(0xFFFF5252), fontSize = 11.sp, modifier = Modifier.padding(start = 8.dp, top = 2.dp))
                    }

                    // Password Strength Bar (Register Mode)
                    if (authMode == AuthMode.REGISTER && passwordInput.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(6.dp))
                        Column(modifier = Modifier.fillMaxWidth()) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Password Strength:",
                                    fontSize = 11.sp,
                                    color = Color.White.copy(alpha = 0.7f)
                                )
                                Text(
                                    text = passwordStrength.label,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = passwordStrength.color
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            LinearProgressIndicator(
                                progress = { passwordStrength.fraction },
                                color = passwordStrength.color,
                                trackColor = Color.White.copy(alpha = 0.15f),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(4.dp)
                                    .clip(RoundedCornerShape(2.dp))
                            )
                        }
                    }

                    // Confirm Password Field (Register Mode Only)
                    AnimatedVisibility(visible = authMode == AuthMode.REGISTER) {
                        Column(modifier = Modifier.padding(top = 14.dp)) {
                            OutlinedTextField(
                                value = confirmPasswordInput,
                                onValueChange = {
                                    confirmPasswordInput = it
                                    confirmPasswordError = if (it != passwordInput) "Passwords do not match" else null
                                },
                                label = { Text("Confirm Password", color = Color.White.copy(alpha = 0.8f)) },
                                leadingIcon = { Icon(Icons.Filled.LockReset, contentDescription = null, tint = Color(0xFF009688)) },
                                visualTransformation = PasswordVisualTransformation(),
                                singleLine = true,
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                                isError = confirmPasswordError != null,
                                shape = RoundedCornerShape(16.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF009688),
                                    unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("auth_confirm_password_input")
                            )
                            if (confirmPasswordError != null) {
                                Text(text = confirmPasswordError!!, color = Color(0xFFFF5252), fontSize = 11.sp, modifier = Modifier.padding(start = 8.dp, top = 2.dp))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Remember Me & Forgot Password Row (Login Mode)
                    if (authMode == AuthMode.LOGIN) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Checkbox(
                                    checked = rememberMe,
                                    onCheckedChange = { rememberMe = it },
                                    colors = CheckboxDefaults.colors(
                                        checkedColor = Color(0xFF009688),
                                        uncheckedColor = Color.White.copy(alpha = 0.6f)
                                    )
                                )
                                Text(
                                    text = "Remember Me",
                                    fontSize = 12.sp,
                                    color = Color.White.copy(alpha = 0.9f)
                                )
                            }

                            TextButton(onClick = {
                                resetEmailInput = emailInput
                                showForgotPasswordDialog = true
                            }) {
                                Text(
                                    text = "Forgot Password?",
                                    fontSize = 12.sp,
                                    color = Color(0xFF38BDF8),
                                    fontWeight = FontWeight.SemiBold
                                )
                            }
                        }
                    } else {
                        // Terms & Conditions Checkbox (Register Mode)
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Checkbox(
                                checked = acceptedTerms,
                                onCheckedChange = { acceptedTerms = it },
                                colors = CheckboxDefaults.colors(
                                    checkedColor = Color(0xFF009688),
                                    uncheckedColor = Color.White.copy(alpha = 0.6f)
                                )
                            )
                            Text(
                                text = "I accept TravelNest ",
                                fontSize = 12.sp,
                                color = Color.White.copy(alpha = 0.8f)
                            )
                            Text(
                                text = "Terms & Privacy",
                                fontSize = 12.sp,
                                color = Color(0xFF38BDF8),
                                fontWeight = FontWeight.Bold,
                                textDecoration = TextDecoration.Underline,
                                modifier = Modifier.clickable { showTermsDialog = true }
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Primary Auth Action Button (Login / Register)
                    Button(
                        onClick = {
                            if (authMode == AuthMode.LOGIN) {
                                if (emailInput.isNotBlank() && passwordInput.isNotBlank()) {
                                    viewModel.loginWithEmail(emailInput, passwordInput, rememberMe)
                                } else {
                                    if (emailInput.isBlank()) emailError = "Email required"
                                    if (passwordInput.isBlank()) passwordError = "Password required"
                                }
                            } else {
                                if (nameInput.isNotBlank() && emailInput.isNotBlank() && passwordInput.length >= 6 && passwordInput == confirmPasswordInput && acceptedTerms) {
                                    viewModel.registerWithEmail(nameInput, emailInput, phoneInput, passwordInput)
                                } else {
                                    if (nameInput.isBlank()) nameError = "Name required"
                                    if (emailInput.isBlank()) emailError = "Email required"
                                    if (passwordInput.length < 6) passwordError = "At least 6 chars"
                                    if (passwordInput != confirmPasswordInput) confirmPasswordError = "Passwords match required"
                                }
                            }
                        },
                        enabled = !isAuthLoading,
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF009688),
                            disabledContainerColor = Color(0xFF009688).copy(alpha = 0.5f)
                        ),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                            .testTag("auth_primary_button")
                    ) {
                        if (isAuthLoading) {
                            CircularProgressIndicator(
                                color = Color.White,
                                strokeWidth = 2.5.dp,
                                modifier = Modifier.size(24.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text("Authenticating Firebase...", color = Color.White, fontWeight = FontWeight.Bold)
                        } else {
                            Text(
                                text = if (authMode == AuthMode.LOGIN) "Sign In to TravelNest" else "Create TravelNest Account",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Icon(Icons.Filled.ArrowForward, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // Divider for Social Login
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        HorizontalDivider(
                            modifier = Modifier.weight(1f),
                            color = Color.White.copy(alpha = 0.2f)
                        )
                        Text(
                            text = "  or connect with  ",
                            fontSize = 11.sp,
                            color = Color.White.copy(alpha = 0.6f)
                        )
                        HorizontalDivider(
                            modifier = Modifier.weight(1f),
                            color = Color.White.copy(alpha = 0.2f)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Social Login Icons Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // Google Sign-In
                        SocialAuthChip(
                            icon = Icons.Filled.GMobiledata,
                            label = "Google",
                            backgroundColor = Color.White,
                            contentColor = Color(0xFF4285F4),
                            modifier = Modifier
                                .weight(1f)
                                .testTag("google_login_chip")
                        ) {
                            viewModel.loginWithGoogle()
                        }

                        // Apple Sign-In
                        SocialAuthChip(
                            icon = Icons.Filled.PhoneIphone,
                            label = "Apple",
                            backgroundColor = Color.Black,
                            contentColor = Color.White,
                            modifier = Modifier
                                .weight(1f)
                                .testTag("apple_login_chip")
                        ) {
                            viewModel.loginWithSocial("Apple ID")
                        }

                        // Facebook Sign-In
                        SocialAuthChip(
                            icon = Icons.Filled.Public,
                            label = "Facebook",
                            backgroundColor = Color(0xFF1877F2),
                            contentColor = Color.White,
                            modifier = Modifier
                                .weight(1f)
                                .testTag("facebook_login_chip")
                        ) {
                            viewModel.loginWithSocial("Facebook")
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    // Mode Toggle Switcher
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Text(
                            text = if (authMode == AuthMode.LOGIN) "Don't have an account? " else "Already have an account? ",
                            fontSize = 13.sp,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                        TextButton(
                            onClick = {
                                authMode = if (authMode == AuthMode.LOGIN) AuthMode.REGISTER else AuthMode.LOGIN
                                emailError = null
                                passwordError = null
                                confirmPasswordError = null
                            },
                            modifier = Modifier.testTag("auth_mode_toggle")
                        ) {
                            Text(
                                text = if (authMode == AuthMode.LOGIN) "Register" else "Sign In",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF009688)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Footer Disclaimer
            Text(
                text = "Powered by TravelNest Secure Firebase Auth & Encrypted Vault",
                fontSize = 11.sp,
                color = Color.White.copy(alpha = 0.5f),
                textAlign = TextAlign.Center
            )
        }
    }

    // Forgot Password Dialog
    if (showForgotPasswordDialog) {
        AlertDialog(
            onDismissRequest = { showForgotPasswordDialog = false },
            title = { Text("Reset Password", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text(
                        text = "Enter your TravelNest registered email address to receive a secure password reset link.",
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    OutlinedTextField(
                        value = resetEmailInput,
                        onValueChange = { resetEmailInput = it },
                        label = { Text("Email Address") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (resetEmailInput.isNotBlank()) {
                            viewModel.sendForgotPasswordEmail(resetEmailInput)
                            showForgotPasswordDialog = false
                        }
                    },
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Send Reset Link")
                }
            },
            dismissButton = {
                TextButton(onClick = { showForgotPasswordDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Terms & Privacy Dialog
    if (showTermsDialog) {
        AlertDialog(
            onDismissRequest = { showTermsDialog = false },
            title = { Text("Terms of Service & Privacy Policy", fontWeight = FontWeight.Bold) },
            text = {
                Column(
                    modifier = Modifier.verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "TravelNest respects your data privacy. By creating an account:",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 13.sp
                    )
                    Text(
                        text = "1. All AI itineraries generated via Gemini are stored securely in your personal cloud vault.\n" +
                                "2. Your email, travel history, and budget preferences are encrypted end-to-end.\n" +
                                "3. You can export or delete your user data at any time from your Profile Settings.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f)
                    )
                }
            },
            confirmButton = {
                Button(onClick = { showTermsDialog = false }) {
                    Text("I Agree")
                }
            }
        )
    }
}

@Composable
private fun SocialAuthChip(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    backgroundColor: Color,
    contentColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(14.dp),
        color = backgroundColor,
        shadowElevation = 4.dp,
        modifier = modifier.height(44.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = label,
                tint = contentColor,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = label,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = contentColor
            )
        }
    }
}
