package com.example.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun InteractiveMapCard(
    locationName: String,
    lat: Double,
    lng: Double,
    modifier: Modifier = Modifier
) {
    var zoomLevel by remember { mutableStateOf(1.0f) }

    Card(
        modifier = modifier
            .testTag("interactive_map_card")
            .fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
        ) {
            // Simulated Map Canvas with Grid Lines and Stylized Land & Route
            val gridColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.08f)
            val pathColor = MaterialTheme.colorScheme.primary

            Canvas(modifier = Modifier.fillMaxSize()) {
                val width = size.width
                val height = size.height

                // Draw Grid Lines
                val step = 40.dp.toPx() * zoomLevel
                var x = 0f
                while (x < width) {
                    drawLine(gridColor, Offset(x, 0f), Offset(x, height), strokeWidth = 1f)
                    x += step
                }
                var y = 0f
                while (y < height) {
                    drawLine(gridColor, Offset(0f, y), Offset(width, y), strokeWidth = 1f)
                    y += step
                }

                // Draw Stylized Route Polyline
                val path = Path().apply {
                    moveTo(width * 0.2f, height * 0.7f)
                    quadraticTo(width * 0.35f, height * 0.3f, width * 0.5f, height * 0.5f)
                    lineTo(width * 0.8f, height * 0.35f)
                }

                drawPath(
                    path = path,
                    color = pathColor,
                    style = Stroke(width = 6f * zoomLevel)
                )

                // Draw Activity Waypoints
                drawCircle(pathColor, radius = 10f * zoomLevel, center = Offset(width * 0.2f, height * 0.7f))
                drawCircle(Color(0xFFFF7043), radius = 10f * zoomLevel, center = Offset(width * 0.35f, height * 0.3f))
                drawCircle(Color(0xFFFFB74D), radius = 10f * zoomLevel, center = Offset(width * 0.5f, height * 0.5f))
            }

            // Pin Marker Overlay at center
            Column(
                modifier = Modifier.align(Alignment.Center),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Surface(
                    color = MaterialTheme.colorScheme.primary,
                    shape = RoundedCornerShape(12.dp),
                    shadowElevation = 6.dp
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Filled.LocationOn,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = locationName,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
                Icon(
                    imageVector = Icons.Filled.Navigation,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier
                        .size(20.dp)
                        .offset(y = (-4).dp)
                )
            }

            // Coordinates Badge
            Surface(
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(12.dp),
                color = Color.Black.copy(alpha = 0.6f),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text(
                    text = "GPS: ${String.format("%.4f", lat)}° N, ${String.format("%.4f", lng)}° E",
                    color = Color.White,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                )
            }

            // Zoom Controls
            Column(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(12.dp)
            ) {
                SmallFloatingActionButton(
                    onClick = { if (zoomLevel < 2.0f) zoomLevel += 0.2f },
                    containerColor = MaterialTheme.colorScheme.surface,
                    contentColor = MaterialTheme.colorScheme.onSurface,
                    shape = CircleShape,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(Icons.Filled.Add, contentDescription = "Zoom In", modifier = Modifier.size(16.dp))
                }
                Spacer(modifier = Modifier.height(6.dp))
                SmallFloatingActionButton(
                    onClick = { if (zoomLevel > 0.6f) zoomLevel -= 0.2f },
                    containerColor = MaterialTheme.colorScheme.surface,
                    contentColor = MaterialTheme.colorScheme.onSurface,
                    shape = CircleShape,
                    modifier = Modifier.size(32.dp)
                ) {
                    Icon(Icons.Filled.Remove, contentDescription = "Zoom Out", modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}
