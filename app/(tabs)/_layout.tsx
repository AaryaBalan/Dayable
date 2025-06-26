import { COLORS } from '@/constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayouts() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.white,
                tabBarStyle: {
                    backgroundColor: COLORS.background, 
                    borderTopWidth: 0,                 
                    height: 60,                         
                    paddingBottom: 10,                  
                    paddingTop: 10,
                    elevation: 10,                      
                    shadowColor: COLORS.white,
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: -3 },
                    shadowRadius: 10,
                },
            }}
        >
            <Tabs.Screen
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="home" size={size} color={color} />
                }}
                name='index'
            />
            <Tabs.Screen
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="bookmark" size={size} color={color} />
                }}
                name='bookmark'
            />
            <Tabs.Screen
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="add-circle" size={size} color={color} />
                }}
                name='create'
            />
            <Tabs.Screen
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="heart" size={size} color={color} />
                }}
                name='notification'
            />
            <Tabs.Screen
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name="person-circle" size={size} color={color} />
                }}
                name='profile'
            />
        </Tabs>
    )
}