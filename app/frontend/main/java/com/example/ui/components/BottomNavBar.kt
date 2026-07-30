package com.example.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ui.TravelTab

@Composable
fun TravelNestBottomBar(
    currentTab: TravelTab,
    onTabSelected: (TravelTab) -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier
            .fillMaxWidth()
            .shadow(16.dp, RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)),
        color = MaterialTheme.colorScheme.surface.copy(alpha = 0.95f),
        tonalElevation = 8.dp
    ) {
        Row(
            modifier = Modifier
                .navigationBarsPadding()
                .fillMaxWidth()
                .height(68.dp)
                .padding(horizontal = 8.dp, vertical = 6.dp),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            TravelTab.entries.forEach { tab ->
                val isSelected = tab == currentTab
                val tabIcon = getTabIcon(tab, isSelected)

                val scale by animateFloatAsState(
                    targetValue = if (isSelected) 1.08f else 1.0f,
                    animationSpec = spring(stiffness = Spring.StiffnessMediumLow),
                    label = "tab_scale"
                )

                val activeColor = MaterialTheme.colorScheme.primary
                val inactiveColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.55f)

                val iconColor by animateColorAsState(
                    targetValue = if (isSelected) activeColor else inactiveColor,
                    label = "tab_icon_color"
                )

                Box(
                    modifier = Modifier
                        .testTag("nav_tab_${tab.route}")
                        .weight(1f)
                        .scale(scale)
                        .clip(RoundedCornerShape(18.dp))
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) { onTabSelected(tab) }
                        .padding(vertical = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .clip(CircleShape)
                                .background(
                                    if (isSelected) activeColor.copy(alpha = 0.12f)
                                    else Color.Transparent
                                )
                                .padding(horizontal = 12.dp, vertical = 4.dp)
                        ) {
                            Icon(
                                imageVector = tabIcon,
                                contentDescription = tab.title,
                                tint = iconColor,
                                modifier = Modifier.size(22.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(2.dp))

                        Text(
                            text = tab.title,
                            fontSize = 11.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                            color = iconColor,
                            maxLines = 1
                        )
                    }
                }
            }
        }
    }
}

private fun getTabIcon(tab: TravelTab, isSelected: Boolean): ImageVector {
    return when (tab) {
        TravelTab.HOME -> if (isSelected) Icons.Filled.Home else Icons.Outlined.Home
        TravelTab.EXPLORE -> if (isSelected) Icons.Filled.Explore else Icons.Outlined.Explore
        TravelTab.AI_PLAN -> if (isSelected) Icons.Filled.AutoAwesome else Icons.Outlined.AutoAwesome
        TravelTab.SAVED -> if (isSelected) Icons.Filled.Bookmark else Icons.Outlined.BookmarkBorder
        TravelTab.PROFILE -> if (isSelected) Icons.Filled.Person else Icons.Outlined.Person
    }
}
