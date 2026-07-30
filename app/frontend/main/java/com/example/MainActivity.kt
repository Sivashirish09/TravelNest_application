package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.example.ui.MainViewModel
import com.example.ui.TravelTab
import com.example.ui.components.TravelNestBottomBar
import com.example.ui.screens.*
import com.example.ui.theme.TravelNestTheme

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            val userProfile by viewModel.userProfile.collectAsState()
            val currentTab by viewModel.currentTab.collectAsState()
            val isLoggedIn by viewModel.isLoggedIn.collectAsState()

            TravelNestTheme(darkTheme = userProfile.isDarkMode) {
                Crossfade(targetState = isLoggedIn, label = "auth_crossfade") { authenticated ->
                    if (!authenticated) {
                        AuthScreen(viewModel = viewModel)
                    } else {
                        Scaffold(
                            bottomBar = {
                                TravelNestBottomBar(
                                    currentTab = currentTab,
                                    onTabSelected = { tab -> viewModel.setTab(tab) }
                                )
                            },
                            modifier = Modifier.fillMaxSize()
                        ) { innerPadding ->
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(innerPadding)
                            ) {
                                Crossfade(targetState = currentTab, label = "tab_crossfade") { tab ->
                                    when (tab) {
                                        TravelTab.HOME -> HomeScreen(viewModel = viewModel)
                                        TravelTab.EXPLORE -> ExploreScreen(viewModel = viewModel)
                                        TravelTab.AI_PLAN -> AiPlanScreen(viewModel = viewModel)
                                        TravelTab.SAVED -> SavedScreen(viewModel = viewModel)
                                        TravelTab.PROFILE -> ProfileScreen(viewModel = viewModel)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

