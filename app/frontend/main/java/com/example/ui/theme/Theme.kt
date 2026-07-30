package com.example.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val TravelNestLightColorScheme = lightColorScheme(
    primary = TravelBluePrimary,
    onPrimary = Color.White,
    primaryContainer = LightSurfaceVariant,
    onPrimaryContainer = TextPrimary,
    secondary = AccentGreen,
    onSecondary = Color.White,
    tertiary = AccentOrange,
    background = LightBackground,
    surface = LightSurface,
    surfaceVariant = LightSurfaceVariant,
    onBackground = TextPrimary,
    onSurface = TextPrimary,
    onSurfaceVariant = TextSecondary,
    outline = LightBorder
)

@Composable
fun TravelNestTheme(
    darkTheme: Boolean = false, // Enforce White/Light Theme as requested
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = TravelNestLightColorScheme,
        typography = Typography,
        content = content
    )
}
