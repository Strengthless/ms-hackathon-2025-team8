import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Title, FAB } from "react-native-paper";
import TaskCard from "../components/TaskCard";
import { tasks } from "../constants/mockData";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../AppNavigator"

type MainScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Main">;
};

const TasksScreen: React.FC<MainScreenProps> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Title style={styles.title}>Weekly Tasks</Title>
        </View>

        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => navigation.navigate("Assignment", { ass_id: task.id })} />
        ))}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => console.log("Add new task")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200EE",
  },
});

export default TasksScreen;
