import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Plus, ListBullets, ChartLine, DotsThree } from "lucide-react-native";
import { Card } from "@/components/ui/card";

function TransactionsScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-lg font-bold text-[#111418]">Transactions</Text>
        <TouchableOpacity className="h-12 w-12 items-center justify-center">
          <Plus size={24} color="#111418" />
        </TouchableOpacity>
      </View>

      {/* Card 1 */}
      <View className="px-4 py-2">
        <Card className="rounded-lg overflow-hidden">
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYeDs1qYAp68KcEwJf0BvcgHzNWlsD4rWD1zfAIY67fiQzFWiWiR2hoXFcKufJrnuby_pW5do1VWVgF4pPmNb2XfYCnJexkVHekp5Z4eFO855w-vuk_RJhyppT0haO8krit0FSFSwlbS9YDPk2rpr1LBenyc9bgxOq4CrjH2TPiVLXfqhGtW6MvzDXkNmgq0jdS81qAZDsMct7eCrFEhuxrFPDPoFFfkBsWuH1w4a2ue_E6ya_VyjGQQyArxxXSnZw4iyOJZYRSc97' }}
            className="w-full aspect-video"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="text-lg font-bold text-[#111418]">View/Add Transactions</Text>
            <Text className="text-base text-[#60758a]">View and manage your transactions</Text>
          </View>
        </Card>
      </View>

      {/* Card 2 */}
      <View className="px-4 py-2">
        <Card className="rounded-lg overflow-hidden">
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOvnk2x-hVflCz27mlZOL_0p4NOp4YEMSpDyq-QcYacll3GOgqZkN_xPIoY-CoVcAExi-CeZtR4tOYG5tlx3RZwbp6w7fC3UMrrVkLMCki7LWQrEA5iYDlaOK95A--lN_CscN2MUmubiDSvWIk2R5SFNZ6xvcz9_V1D3srGEVqoBXwUbu3qtoc-IVCup8ThDJHYAFS8AcoDfc8mva4neliJRnZmP1ebXz2Is6BybKs6iHJofvkef4STpiABszoC85XaksmUEEn9qEg' }}
            className="w-full aspect-video"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="text-lg font-bold text-[#111418]">Budgets</Text>
            <Text className="text-base text-[#60758a]">Manage your budgets</Text>
          </View>
        </Card>
      </View>

      {/* Card 3 */}
      <View className="px-4 py-2">
        <Card className="rounded-lg overflow-hidden">
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1JA2698GT3-FpJG_5XE67bF_cLDI5LSjcNlD8UgDVJC075OEi-1lukKFADN0E6K_5KgWkO8du7lRBm0X_s2V4msdv2Gjc1picc6Eb9QIwJH5VsFgSmmIsfs58vHHxpGndjwgW2r2U5bB6ZPyJm5utW1EHUh8zBolF1bQeahSB-LprjPNrbpl1WiBPJAecvrXAGtBBZQJq4i153CSjsO1dZph4BcUO43OAx6Idofr4MImALrWayZBXYbwUJVX3HLKT7bdN8hAocMiZ' }}
            className="w-full aspect-video"
            resizeMode="cover"
          />
          <View className="p-4">
            <Text className="text-lg font-bold text-[#111418]">Fixed Payments</Text>
            <Text className="text-base text-[#60758a]">Manage your fixed payments</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

function StatisticsScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg">Statistics</Text>
    </View>
  );
}

function MoreScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg">More</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <NavigationContainer independent>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{ tabBarIcon: ({ color }) => <ListBullets size={24} color={color} /> }}
        />
        <Tab.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ tabBarIcon: ({ color }) => <ChartLine size={24} color={color} /> }}
        />
        <Tab.Screen
          name="More"
          component={MoreScreen}
          options={{ tabBarIcon: ({ color }) => <DotsThree size={24} color={color} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
