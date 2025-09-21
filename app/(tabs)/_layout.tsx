import { Ionicons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="routeFinder"
        options={{
          title: 'Route Finder',
          tabBarLabel: 'Route Finder',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
        <Tabs.Screen
          name="RouteSearcher"
          options={{
            title: 'Route Searcher',
            tabBarLabel: 'Route Searcher',
            headerShown: true,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" size={size} color={color} />
            ),
          }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarLabel: 'Profile',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />  
          ),
        }}
      />
      <Tabs.Screen
        name="NearByStopFinder"
        options={{
          title: 'Nearby Stop',
          tabBarLabel: 'Nearby Stop',
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default _layout